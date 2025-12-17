import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkRateLimit, RateLimitError } from '@/lib/rateLimit'
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize'
import { handleApiError, ValidationError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  enquiry_type: z.enum(['temple', 'donation', 'school-admissions', 'ritual-booking']).optional(),
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
    const validationResult = contactSchema.safeParse(body)
    
    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json(
        { error: message, details },
        { status: statusCode }
      )
    }

    const data = validationResult.data

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(data.name),
      email: sanitizeEmail(data.email),
      phone: sanitizePhone(data.phone),
      subject: sanitizeString(data.subject),
      message: sanitizeString(data.message),
      enquiry_type: data.enquiry_type || null,
    }

    // Validate sanitized email (sanitizeEmail returns empty string if invalid)
    if (!sanitizedData.email) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Insert contact enquiry using parameterized query (SQL injection protection)
    const result = await query(
      `INSERT INTO contact_enquiries 
       (name, email, phone, subject, message, enquiry_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.subject,
        sanitizedData.message,
        sanitizedData.enquiry_type,
      ]
    )

    return NextResponse.json(
      {
        success: true,
        enquiry_id: result.rows[0].id,
        message: 'Your enquiry has been submitted successfully',
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
