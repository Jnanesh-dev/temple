import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { finalizeDonationFromWebhook } from '@/app/actions/paymentActions'
import { getRazorpayWebhookSecret } from '@/lib/payment'

const razorpayWebhookSchema = z.object({
  event: z.string().min(1),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().min(1),
        order_id: z.string().min(1).optional(),
      }),
    }),
  }),
})

function signaturesMatch(expectedSignature: string, providedSignature: string): boolean {
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const providedBuffer = Buffer.from(providedSignature, 'utf8')

  if (expectedBuffer.length !== providedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')?.trim()
    const secret = await getRazorpayWebhookSecret()

    if (!secret) {
      console.error('Razorpay Webhook Secret not configured')
      return NextResponse.json({ error: 'Config error' }, { status: 500 })
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    if (!signaturesMatch(expectedSignature, signature)) {
      console.warn('Invalid Razorpay Webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const parsedPayload = razorpayWebhookSchema.safeParse(JSON.parse(rawBody))
    if (!parsedPayload.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const event = parsedPayload.data
    console.log('Razorpay Webhook received:', event.event)

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id

      if (orderId) {
        const donation = await prisma.donation.findFirst({
          where: { razorpayOrderId: orderId },
        })

        if (donation) {
          await finalizeDonationFromWebhook(donation.id, payment.id)
          console.log(`Donation ${donation.id} completed via webhook`)
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
