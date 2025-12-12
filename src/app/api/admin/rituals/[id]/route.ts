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

  const ritual = await prisma.ritual.findUnique({
    where: { id: params.id },
  })

  if (!ritual) {
    return NextResponse.json({ error: 'Ritual not found' }, { status: 404 })
  }

  return NextResponse.json({ ritual })
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
    const { name, description, suggestedDonation, duration, timing, order, isActive } = body

    const ritual = await prisma.ritual.update({
      where: { id: params.id },
      data: {
        name,
        description,
        suggestedDonation: parseFloat(suggestedDonation),
        duration,
        timing,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json({ success: true, ritual })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update ritual' },
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
    await prisma.ritual.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete ritual' },
      { status: 500 }
    )
  }
}

