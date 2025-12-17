import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkRateLimit } from '@/lib/rateLimit'
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize'
import { handleApiError, ValidationError, RateLimitError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema
const admissionSchema = z.object({
  student_name: z.string().min(2, 'Student name must be at least 2 characters').max(100),
  parent_name: z.string().min(2, 'Parent name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  class_interested: z.string().min(1, 'Please select a class').max(50),
  message: z.string().max(2000).optional(),
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
    const validationResult = admissionSchema.safeParse(body)

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
      student_name: sanitizeString(data.student_name),
      parent_name: sanitizeString(data.parent_name),
      email: sanitizeEmail(data.email),
      phone: sanitizePhone(data.phone),
      class_interested: sanitizeString(data.class_interested),
      message: data.message ? sanitizeString(data.message) : null,
    }

    // Validate sanitized email
    if (!sanitizedData.email) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Insert admission enquiry using parameterized query (SQL injection protection)
    const result = await query(
      `INSERT INTO admission_enquiries 
       (student_name, parent_name, email, phone, class_interested, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        sanitizedData.student_name,
        sanitizedData.parent_name,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.class_interested,
        sanitizedData.message,
      ]
    )

    return NextResponse.json(
      {
        success: true,
        enquiry_id: result.rows[0].id,
        message: 'Your admission enquiry has been submitted successfully',
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
