import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError } from '@/lib/errors'
import { sanitizeString, sanitizeUrl } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema
const galleryImageSchema = z.object({
  fileUrl: z.string().url('Invalid file URL').max(2048),
  fileName: z.string().min(1, 'File name is required').max(255),
  category: z.enum(['temple', 'festivals', 'devotees', 'school'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  altText: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()

    // Validate input with Zod
    const validationResult = galleryImageSchema.safeParse(body)

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const data = validationResult.data

    // Sanitize inputs
    const sanitizedData = {
      fileUrl: sanitizeUrl(data.fileUrl),
      fileName: sanitizeString(data.fileName),
      category: data.category,
      altText: data.altText ? sanitizeString(data.altText) : null,
      uploadedBy: session.user.id,
    }

    // Validate sanitized URL
    if (!sanitizedData.fileUrl) {
      return NextResponse.json({ error: 'Invalid file URL format' }, { status: 400 })
    }

    const image = await prisma.galleryImage.create({
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, image })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, images })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
