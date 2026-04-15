import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, NotFoundError, ValidationError } from '@/lib/errors'
import { deleteFile } from '@/lib/minio'
import { getObjectNameFromFileUrl } from '@/lib/media'
import { sanitizeString } from '@/lib/sanitize'

const galleryImagePatchSchema = z.object({
  altText: z.string().max(500).optional().or(z.literal('')),
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const image = await prisma.galleryImage.findUnique({
      where: { id },
    })

    if (!image) {
      const error = new NotFoundError('Image not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Delete from MinIO (best effort - don't fail if this fails)
    try {
      const objectName = getObjectNameFromFileUrl(image.fileUrl)

      if (objectName) {
        await deleteFile(objectName)
      }
    } catch (error) {
      console.error('Error deleting from MinIO:', error)
      // Continue with database deletion even if MinIO deletion fails
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const validationResult = galleryImagePatchSchema.safeParse(await request.json())

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const altText = validationResult.data.altText
      ? sanitizeString(validationResult.data.altText)
      : null

    const image = await prisma.galleryImage.update({
      where: { id },
      data: { altText },
    })

    return NextResponse.json({ success: true, image })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
