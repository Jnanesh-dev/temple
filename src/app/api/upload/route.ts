import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToMinIO } from '@/lib/minio'
import { handleApiError, AuthorizationError, ValidationError } from '@/lib/errors'
import { checkRateLimit, RateLimitError } from '@/lib/rateLimit'

// Allowed file types (MIME types)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase()
}

/**
 * Validate file
 */
function validateFile(file: File): { valid: boolean; error?: string } {
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

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
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

  return { valid: true }
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
    const folder = (formData.get('folder') as string) || 'public'

    // Validate file exists
    if (!file) {
      const error = new ValidationError('No file provided')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      const error = new ValidationError(validation.error || 'Invalid file')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Sanitize folder name (prevent directory traversal)
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '')

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename to prevent overwrites and collisions
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const extension = getFileExtension(file.name)
    const fileName = `${timestamp}-${randomSuffix}${extension}`
    const filePath = `${sanitizedFolder}/${fileName}`

    // Upload to MinIO
    const url = await uploadToMinIO(filePath, buffer, file.type)

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
