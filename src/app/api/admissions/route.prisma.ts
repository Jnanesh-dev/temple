import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_name, parent_name, email, phone, class_interested, message } = body

    // Create admission enquiry using Prisma
    const enquiry = await prisma.admissionEnquiry.create({
      data: {
        studentName: student_name,
        parentName: parent_name,
        email,
        phone,
        classInterested: class_interested,
        message,
      },
    })

    return NextResponse.json({
      success: true,
      enquiry_id: enquiry.id,
      message: 'Your admission enquiry has been submitted successfully',
    })
  } catch (error: any) {
    console.error('Admission enquiry error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit admission enquiry' },
      { status: 500 }
    )
  }
}

