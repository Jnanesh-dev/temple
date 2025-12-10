import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_name, parent_name, email, phone, class_interested, message } = body

    // Insert admission enquiry
    const result = await query(
      `INSERT INTO admission_enquiries 
       (student_name, parent_name, email, phone, class_interested, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [student_name, parent_name, email, phone, class_interested, message]
    )

    return NextResponse.json({
      success: true,
      enquiry_id: result.rows[0].id,
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

