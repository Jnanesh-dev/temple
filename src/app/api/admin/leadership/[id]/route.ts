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

  const leader = await prisma.leadership.findUnique({
    where: { id: params.id },
  })

  if (!leader) {
    return NextResponse.json({ error: 'Leader not found' }, { status: 404 })
  }

  return NextResponse.json({ leader })
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
    const { name, designation, role, bio, message, imageUrl, order } = body

    const leader = await prisma.leadership.update({
      where: { id: params.id },
      data: {
        name,
        designation,
        role,
        bio,
        message,
        imageUrl,
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, leader })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update leader' },
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
    await prisma.leadership.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete leader' },
      { status: 500 }
    )
  }
}

