import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rituals = await prisma.ritual.findMany({
    orderBy: { order: 'asc' },
  })

  return NextResponse.json({ rituals })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, suggestedDonation, duration, timing, order, isActive } = body

    const ritual = await prisma.ritual.create({
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
      { error: error.message || 'Failed to create ritual' },
      { status: 500 }
    )
  }
}

