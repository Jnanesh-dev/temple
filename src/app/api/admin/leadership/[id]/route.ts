import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors'
import { sanitizeString, sanitizeUrl, sanitizeHtml } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema (reuse from route.ts)
const leadershipSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  designation: z.string().min(1, 'Designation is required').max(200),
  role: z.string().min(1, 'Role is required').max(100),
  bio: z.string().min(1, 'Bio is required').max(20000),
  message: z.string().max(5000).optional(),
  imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const leader = await prisma.leadership.findUnique({
      where: { id: params.id },
    })

    if (!leader) {
      const error = new NotFoundError('Leader not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    return NextResponse.json({ leader })
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
    const validationResult = leadershipSchema.safeParse(body)

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const data = validationResult.data

    // Check if leader exists
    const existingLeader = await prisma.leadership.findUnique({
      where: { id: params.id },
    })

    if (!existingLeader) {
      const error = new NotFoundError('Leader not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(data.name),
      designation: sanitizeString(data.designation),
      role: sanitizeString(data.role),
      bio: sanitizeHtml(data.bio), // HTML content
      message: data.message ? sanitizeHtml(data.message) : null, // HTML content
      imageUrl: data.imageUrl ? sanitizeUrl(data.imageUrl) : null,
      order: data.order,
    }

    // Validate sanitized URL
    if (data.imageUrl && !sanitizedData.imageUrl) {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 })
    }

    const leader = await prisma.leadership.update({
      where: { id: params.id },
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, leader })
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

    // Check if leader exists
    const existingLeader = await prisma.leadership.findUnique({
      where: { id: params.id },
    })

    if (!existingLeader) {
      const error = new NotFoundError('Leader not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    await prisma.leadership.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
