import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, enquiry_type } = body

    // Create contact enquiry using Prisma
    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        enquiryType: enquiry_type,
      },
    })

    return NextResponse.json({
      success: true,
      enquiry_id: enquiry.id,
      message: 'Your enquiry has been submitted successfully',
    })
  } catch (error: any) {
    console.error('Contact enquiry error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    )
  }
}

