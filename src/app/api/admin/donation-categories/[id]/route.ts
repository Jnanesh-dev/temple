import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors'
import { sanitizeString, sanitizeHtml } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema (reuse from route.ts)
const donationCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const category = await prisma.donationCategory.findUnique({
      where: { id: id },
    })

    if (!category) {
      const error = new NotFoundError('Category not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    return NextResponse.json({ category })
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
    const validationResult = donationCategorySchema.safeParse(body)

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const data = validationResult.data

    // Check if category exists
    const existingCategory = await prisma.donationCategory.findUnique({
      where: { id: id },
    })

    if (!existingCategory) {
      const error = new NotFoundError('Category not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(data.name),
      description: sanitizeHtml(data.description), // HTML content
      order: data.order,
      isActive: data.isActive,
    }

    const category = await prisma.donationCategory.update({
      where: { id: id },
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, category })
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

    // Check if category exists
    const existingCategory = await prisma.donationCategory.findUnique({
      where: { id: id },
    })

    if (!existingCategory) {
      const error = new NotFoundError('Category not found')
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    await prisma.donationCategory.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
