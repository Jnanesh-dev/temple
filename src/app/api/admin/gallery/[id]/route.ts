import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, NotFoundError } from '@/lib/errors'
import { deleteFile } from '@/lib/minio'

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
      await deleteFile(image.fileUrl)
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
    const body = await request.json()
    const { altText } = body

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
