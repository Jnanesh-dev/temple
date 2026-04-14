import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { query } from '@/lib/db'
import { checkRateLimit } from '@/lib/rateLimit'
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize'
import { handleApiError, ValidationError, RateLimitError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema
const donationSchema = z.object({
  donor_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  donor_email: z.string().email('Invalid email address').max(255),
  donor_phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  donor_address: z.string().max(500).optional(),
  amount: z.number().min(100, 'Minimum donation amount is ₹100').max(10000000, 'Maximum donation amount is ₹1 crore'),
  purpose: z.string().min(1, 'Please select a donation purpose').max(100),
  frequency: z.enum(['one-time', 'monthly'], {
    errorMap: () => ({ message: 'Frequency must be either one-time or monthly' }),
  }),
})

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per 15 minutes per IP
  const rateLimitResult = checkRateLimit(request, 5, 15 * 60 * 1000)

  if (!rateLimitResult.success) {
    const error = new RateLimitError('Too many requests. Please try again later.')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json(
      { error: message },
      {
        status: statusCode,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  }

  try {
    const body = await request.json()

    // Validate input with Zod
    const validationResult = donationSchema.safeParse(body)

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const data = validationResult.data

    // Sanitize inputs
    const sanitizedData = {
      donor_name: sanitizeString(data.donor_name),
      donor_email: sanitizeEmail(data.donor_email),
      donor_phone: sanitizePhone(data.donor_phone),
      donor_address: data.donor_address ? sanitizeString(data.donor_address) : null,
      amount: data.amount, // Already validated as number
      purpose: sanitizeString(data.purpose),
      frequency: data.frequency,
    }

    // Validate sanitized email
    if (!sanitizedData.donor_email) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Insert donation record using parameterized query (SQL injection protection)
    const result = await query(
      `INSERT INTO donations 
       (donor_name, donor_email, donor_phone, donor_address, amount, purpose, frequency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        sanitizedData.donor_name,
        sanitizedData.donor_email,
        sanitizedData.donor_phone,
        sanitizedData.donor_address,
        sanitizedData.amount,
        sanitizedData.purpose,
        sanitizedData.frequency,
      ]
    )

    return NextResponse.json(
      {
        success: true,
        donation_id: result.rows[0].id,
      },
      {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting for GET requests: 20 requests per minute
  const rateLimitResult = checkRateLimit(request, 20, 60000)

  if (!rateLimitResult.success) {
    const error = new RateLimitError('Too many requests. Please try again later.')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }

  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit') || '10'
    const offsetParam = searchParams.get('offset') || '0'

    // Validate and sanitize pagination parameters
    const limit = Math.min(Math.max(parseInt(limitParam, 10) || 10, 1), 100) // Between 1 and 100
    const offset = Math.max(parseInt(offsetParam, 10) || 0, 0) // At least 0

    const result = await query(
      `SELECT id, donor_name, donor_email, amount, purpose, frequency, payment_status, created_at
       FROM donations 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    return NextResponse.json({
      success: true,
      donations: result.rows,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
