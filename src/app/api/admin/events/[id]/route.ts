import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors'
import { sanitizeString, sanitizeUrl } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema (reuse from events/route.ts)
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  eventDate: z.string().datetime('Invalid date format').or(z.date()),
  eventTime: z.string().max(10).optional(),
  eventType: z.enum(['festival', 'satsang', 'special-pooja', 'other'], {
    errorMap: () => ({ message: 'Invalid event type' }),
  }),
  bannerUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      const error = new NotFoundError('Event not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    return NextResponse.json({ event })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      const error = new NotFoundError('Event not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

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
      return NextResponse.json({ error: 'Invalid banner URL format' }, { status: 400 })
    }

    const event = await prisma.event.update({
      where: { id },
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      const error = new NotFoundError('Event not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
