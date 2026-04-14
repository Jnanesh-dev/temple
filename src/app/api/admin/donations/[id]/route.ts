import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { handleApiError, ValidationError } from '@/lib/errors'

const donationStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'completed', 'failed']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const validationResult = donationStatusSchema.safeParse(await request.json())

    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const { paymentStatus } = validationResult.data

    const donation = await prisma.donation.update({
      where: { id },
      data: { paymentStatus },
    })

    return NextResponse.json({ success: true, donation })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
