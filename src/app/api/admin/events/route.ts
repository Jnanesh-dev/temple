import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, ValidationError, AuthorizationError } from '@/lib/errors'
import { sanitizeString, sanitizeUrl } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema for event creation
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  eventDate: z
    .string()
    .min(1, 'Event date is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date format')
    .or(z.date()),
  eventTime: z.string().max(10).optional(),
  eventType: z.enum(['festival', 'satsang', 'special-pooja', 'other'], {
    errorMap: () => ({ message: 'Invalid event type' }),
  }),
  bannerUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    const error = new AuthorizationError('Admin access required')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
    })

    return NextResponse.json({ events })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    const error = new AuthorizationError('Admin access required')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }

  try {
    const body = await request.json()

    // Validate input with Zod
    const validationResult = eventSchema.safeParse(body)

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
      title: sanitizeString(data.title),
      description: data.description ? sanitizeString(data.description) : null,
      eventDate: typeof data.eventDate === 'string' ? new Date(data.eventDate) : data.eventDate,
      eventTime: data.eventTime ? sanitizeString(data.eventTime) : null,
      eventType: data.eventType,
      bannerUrl: data.bannerUrl ? sanitizeUrl(data.bannerUrl) : null,
    }

    // Validate sanitized URL
    if (data.bannerUrl && !sanitizedData.bannerUrl) {
      return NextResponse.json(
        { error: 'Invalid banner URL format' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
