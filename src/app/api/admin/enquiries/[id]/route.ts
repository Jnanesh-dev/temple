import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
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
    const { status } = body

    const enquiry = await prisma.contactEnquiry.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ success: true, enquiry })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update enquiry' },
      { status: 500 }
    )
  }
}

