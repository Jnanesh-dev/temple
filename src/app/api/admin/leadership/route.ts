import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leadership = await prisma.leadership.findMany({
    orderBy: { order: 'asc' },
  })

  return NextResponse.json({ leadership })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, designation, role, bio, message, imageUrl, order } = body

    const leader = await prisma.leadership.create({
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
      { error: error.message || 'Failed to create leader' },
      { status: 500 }
    )
  }
}

