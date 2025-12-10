import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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

    // Insert donation record
    const result = await query(
      `INSERT INTO donations 
       (donor_name, donor_email, donor_phone, donor_address, amount, purpose, frequency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [donor_name, donor_email, donor_phone, donor_address, amount, purpose, frequency]
    )

    return NextResponse.json({
      success: true,
      donation_id: result.rows[0].id,
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

    const result = await query(
      `SELECT * FROM donations 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    return NextResponse.json({
      success: true,
      donations: result.rows,
    })
  } catch (error: any) {
    console.error('Fetch donations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}

