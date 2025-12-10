import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
  })

  return NextResponse.json({ events })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, eventDate, eventTime, eventType, bannerUrl } = body

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        eventTime,
        eventType,
        bannerUrl,
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    )
  }
}

