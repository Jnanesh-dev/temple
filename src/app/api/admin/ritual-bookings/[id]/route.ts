import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { handleApiError, ValidationError } from '@/lib/errors'

const ritualBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const validationResult = ritualBookingStatusSchema.safeParse(await request.json())

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const { status } = validationResult.data

    const booking = await prisma.ritualBooking.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
