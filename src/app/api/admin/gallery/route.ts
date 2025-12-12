import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { fileUrl, fileName, category, altText } = body

    const image = await prisma.galleryImage.create({
      data: {
        fileUrl,
        fileName,
        category,
        altText,
        uploadedBy: session.user.id,
      },
    })

    return NextResponse.json({ success: true, image })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save image' },
      { status: 500 }
    )
  }
}

