import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError } from '@/lib/errors'
import { sanitizeString, sanitizeHtml } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema
const donationCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const categories = await prisma.donationCategory.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
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

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(data.name),
      description: sanitizeHtml(data.description), // HTML content
      order: data.order,
      isActive: data.isActive,
    }

    const category = await prisma.donationCategory.create({
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
