import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deities = await prisma.deity.findMany({
    orderBy: { order: 'asc' },
  })

  return NextResponse.json({ deities })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, festivals, specialDays, imageUrl, order } = body

    const deity = await prisma.deity.create({
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
      { error: error.message || 'Failed to create deity' },
      { status: 500 }
    )
  }
}

