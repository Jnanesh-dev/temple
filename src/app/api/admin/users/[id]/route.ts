import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Prevent deleting yourself
  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: 'You cannot delete your own account' },
      { status: 400 }
    )
  }

  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}

