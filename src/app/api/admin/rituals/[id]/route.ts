import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors'
import { sanitizeString, sanitizeHtml } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema (reuse from route.ts)
const ritualSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required').max(10000),
  suggestedDonation: z.number().min(0, 'Suggested donation must be positive').max(10000000),
  duration: z.string().min(1, 'Duration is required').max(100),
  timing: z.string().min(1, 'Timing is required').max(200),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const ritual = await prisma.ritual.findUnique({
      where: { id: params.id },
    })

    if (!ritual) {
      const error = new NotFoundError('Ritual not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    return NextResponse.json({ ritual })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const body = await request.json()

    // Validate input with Zod
    const validationResult = ritualSchema.safeParse(body)

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const data = validationResult.data

    // Check if ritual exists
    const existingRitual = await prisma.ritual.findUnique({
      where: { id: params.id },
    })

    if (!existingRitual) {
      const error = new NotFoundError('Ritual not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(data.name),
      description: sanitizeHtml(data.description), // HTML content
      suggestedDonation: data.suggestedDonation,
      duration: sanitizeString(data.duration),
      timing: sanitizeString(data.timing),
      order: data.order,
      isActive: data.isActive,
    }

    const ritual = await prisma.ritual.update({
      where: { id: params.id },
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, ritual })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // Check if ritual exists
    const existingRitual = await prisma.ritual.findUnique({
      where: { id: params.id },
    })

    if (!existingRitual) {
      const error = new NotFoundError('Ritual not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    await prisma.ritual.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
