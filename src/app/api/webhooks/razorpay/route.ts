import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { finalizeDonationFromWebhook } from '@/app/actions/paymentActions';
import { getRazorpayWebhookSecret } from '@/lib/payment';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = await getRazorpayWebhookSecret();

    if (!secret) {
      console.error('Razorpay Webhook Secret not configured');
      return NextResponse.json({ error: 'Config error' }, { status: 500 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Invalid Razorpay Webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log('Razorpay Webhook received:', event.event);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      if (orderId) {
        const donation = await prisma.donation.findFirst({
          where: { razorpayOrderId: orderId },
        });

        if (donation) {
          await finalizeDonationFromWebhook(donation.id, payment.id);
          console.log(`Donation ${donation.id} completed via webhook`);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
