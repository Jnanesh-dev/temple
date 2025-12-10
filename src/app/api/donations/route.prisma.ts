import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      donor_name,
      donor_email,
      donor_phone,
      donor_address,
      amount,
      purpose,
      frequency,
    } = body

    // Create donation record using Prisma
    const donation = await prisma.donation.create({
      data: {
        donorName: donor_name,
        donorEmail: donor_email,
        donorPhone: donor_phone,
        donorAddress: donor_address,
        amount: parseFloat(amount),
        purpose,
        frequency,
      },
    })

    return NextResponse.json({
      success: true,
      donation_id: donation.id,
    })
  } catch (error: any) {
    console.error('Donation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save donation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const donations = await prisma.donation.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      donations,
    })
  } catch (error: any) {
    console.error('Fetch donations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}

