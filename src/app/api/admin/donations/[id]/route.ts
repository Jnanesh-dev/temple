import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { paymentStatus } = body

    const donation = await prisma.donation.update({
      where: { id: params.id },
      data: { paymentStatus },
    })

    return NextResponse.json({ success: true, donation })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update donation' },
      { status: 500 }
    )
  }
}

