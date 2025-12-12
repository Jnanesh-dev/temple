import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deity = await prisma.deity.findUnique({
    where: { id: params.id },
  })

  if (!deity) {
    return NextResponse.json({ error: 'Deity not found' }, { status: 404 })
  }

  return NextResponse.json({ deity })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, festivals, specialDays, imageUrl, order } = body

    const deity = await prisma.deity.update({
      where: { id: params.id },
      data: {
        name,
        description,
        festivals: festivals || [],
        specialDays: specialDays || [],
        imageUrl,
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, deity })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update deity' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.deity.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete deity' },
      { status: 500 }
    )
  }
}

