import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import crypto from 'crypto'
import { authOptions } from '@/lib/auth'
import { uploadToMinIO } from '@/lib/minio'
import { handleApiError, AuthorizationError, ValidationError, RateLimitError } from '@/lib/errors'
import { checkRateLimit } from '@/lib/rateLimit'

// Allowed file types (MIME types)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

const EXTENSIONS_BY_MIME_TYPE: Record<AllowedMimeType, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
}

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase()
}

function normalizeMimeType(mimeType: string): string {
  return mimeType.toLowerCase() === 'image/jpg' ? 'image/jpeg' : mimeType.toLowerCase()
}

function detectMimeType(buffer: Buffer): AllowedMimeType | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png'
  }

  if (buffer.length >= 6) {
    const gifHeader = buffer.subarray(0, 6).toString('ascii')
    if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
      return 'image/gif'
    }
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp'
  }

  return null
}

function sanitizeFolderPath(folder: string): string {
  const segments = folder
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter(Boolean)

  if (segments.length === 0) {
    return 'public/uploads'
  }

  if (segments[0] !== 'public') {
    segments.unshift('public')
  }

  return segments.join('/')
}

/**
 * Validate file
 */
function validateFile(file: File, buffer: Buffer): {
  valid: boolean
  error?: string
  mimeType?: AllowedMimeType
} {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' }
  }

  const detectedMimeType = detectMimeType(buffer)
  if (!detectedMimeType) {
    return {
      valid: false,
      error: 'Unsupported or invalid image file. Upload JPG, PNG, GIF, or WebP images only.',
    }
  }

  // Check MIME type
  const normalizedMimeType = normalizeMimeType(file.type)
  if (normalizedMimeType && !ALLOWED_MIME_TYPES.includes(normalizedMimeType as AllowedMimeType)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }
  }

  if (normalizedMimeType && normalizedMimeType !== detectedMimeType) {
    return {
      valid: false,
      error: 'File content does not match the selected image type.',
    }
  }

  // Check file extension
  const extension = getFileExtension(file.name)
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  if (!EXTENSIONS_BY_MIME_TYPE[detectedMimeType].includes(extension)) {
    return {
      valid: false,
      error: 'File extension does not match the uploaded image format.',
    }
  }

  return { valid: true, mimeType: detectedMimeType }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    const error = new AuthorizationError('Admin access required')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }

  // Rate limiting: 20 uploads per minute for admin
  const rateLimitResult = checkRateLimit(request, 20, 60000)

  if (!rateLimitResult.success) {
    const error = new RateLimitError('Too many upload requests. Please try again later.')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'public/uploads'

    // Validate file exists
    if (!file) {
      const error = new ValidationError('No file provided')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Convert file to buffer so we can verify the actual file signature
    const buffer = Buffer.from(await file.arrayBuffer())

    // Validate file
    const validation = validateFile(file, buffer)
    if (!validation.valid) {
      const error = new ValidationError(validation.error || 'Invalid file')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Sanitize folder name (prevent directory traversal)
    const sanitizedFolder = sanitizeFolderPath(folder)

    // Generate unique filename to prevent overwrites and collisions
    const timestamp = Date.now()
    const extension = getFileExtension(file.name)
    const fileName = `${timestamp}-${crypto.randomUUID()}${extension}`
    const filePath = `${sanitizedFolder}/${fileName}`

    // Upload to MinIO
    const url = await uploadToMinIO(filePath, buffer, validation.mimeType || normalizeMimeType(file.type))

    return NextResponse.json(
      {
        success: true,
        url,
        fileName,
        filePath,
      },
      {
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
