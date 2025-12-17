import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError } from '@/lib/errors'
import { sanitizeString, sanitizeUrl, sanitizeHtml } from '@/lib/sanitize'
import { z } from 'zod'

// Validation schema
const deitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(10000),
  festivals: z.array(z.string().max(100)).default([]),
  specialDays: z.array(z.string().max(100)).default([]),
  imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
})

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const deities = await prisma.deity.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ deities })
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
    const validationResult = deitySchema.safeParse(body)

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
      festivals: data.festivals.map((f: string) => sanitizeString(f)),
      specialDays: data.specialDays.map((d: string) => sanitizeString(d)),
      imageUrl: data.imageUrl ? sanitizeUrl(data.imageUrl) : null,
      order: data.order,
    }

    // Validate sanitized URL
    if (data.imageUrl && !sanitizedData.imageUrl) {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 })
    }

    const deity = await prisma.deity.create({
      data: sanitizedData,
    })

    return NextResponse.json({ success: true, deity })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
