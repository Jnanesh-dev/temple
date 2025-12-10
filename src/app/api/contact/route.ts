import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, enquiry_type } = body

    // Insert contact enquiry
    const result = await query(
      `INSERT INTO contact_enquiries 
       (name, email, phone, subject, message, enquiry_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, email, phone, subject, message, enquiry_type]
    )

    return NextResponse.json({
      success: true,
      enquiry_id: result.rows[0].id,
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

