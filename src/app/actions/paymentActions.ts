'use server'

import { prisma } from '@/lib/prisma';
import { getRazorpayClient, getRazorpaySettings } from '@/lib/payment';
import crypto from 'crypto';
import { sendDonationNotification } from './emailActions';

/**
 * Creates a Razorpay order for a donation.
 */
export async function createDonationOrder(formData: {
  amount: number
  name: string
  email: string
  phone: string
  purpose: string
  categoryName?: string
  frequency: string
  address?: string
}) {
  try {
    const razorpay = await getRazorpayClient();

    // Create a pending donation in the DB
    const donation = await prisma.donation.create({
      data: {
        donorName: formData.name,
        donorEmail: formData.email,
        donorPhone: formData.phone,
        donorAddress: formData.address,
        amount: formData.amount,
        purpose: formData.purpose,
        categoryName: formData.categoryName,
        frequency: formData.frequency,
        paymentStatus: 'pending',
      },
    });

    // Create Razorpay Order (amount in paise)
    const order = await razorpay.orders.create({
      amount: Math.round(formData.amount * 100),
      currency: 'INR',
      receipt: donation.id,
      notes: {
        purpose: formData.purpose,
        donor: formData.name,
      },
    });

    // Update donation with Razorpay Order ID
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        razorpayOrderId: order.id,
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      donationId: donation.id,
    };
  } catch (error: any) {
    console.error('Error creating donation order:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Internal helper to finalize a donation (DB update + Email).
 * Can be called by verifyPayment (frontend) or Webhook.
 */
async function markDonationAsCompleted(donationId: string, paymentId: string, signature?: string) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
  });

  if (!donation || donation.paymentStatus === 'completed') return;

  // Update DB
    await prisma.donation.update({
      where: { id: donationId },
      data: {
        paymentStatus: 'completed',
        paymentId,
        transactionId: paymentId,
        razorpaySignature: signature,
      },
    });

  // Send Email Notification
  try {
    await sendDonationNotification({
      name: donation.donorName,
      email: donation.donorEmail,
      phone: donation.donorPhone || '',
      address: donation.donorAddress || undefined,
      amount: Number(donation.amount),
      purpose: donation.purpose,
      frequency: donation.frequency,
    });
  } catch (emailError) {
    console.error('Failed to send donation notification email:', emailError);
    // We don't fail the whole action if email fails, as payment is captured
  }
}

/**
 * Verifies the Razorpay payment signature and updates the donation status.
 */
export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  donationId: string;
}) {
  try {
    const { keySecret } = await getRazorpaySettings();

    if (!keySecret) throw new Error('Razorpay secret missing');

    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(data.razorpay_order_id + '|' + data.razorpay_payment_id)
      .digest('hex');

    if (generated_signature === data.razorpay_signature) {
      await markDonationAsCompleted(data.donationId, data.razorpay_payment_id, data.razorpay_signature);
      return { success: true };
    } else {
      await prisma.donation.update({
        where: { id: data.donationId },
        data: { paymentStatus: 'failed' },
      });
      return { success: false, error: 'Invalid signature' };
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Publicly exposed version of the completion logic for the Webhook handler.
 * Only call this after verifying the webhook signature.
 */
export async function finalizeDonationFromWebhook(donationId: string, paymentId: string) {
  await markDonationAsCompleted(donationId, paymentId);
}

/**
 * Saves or updates Razorpay settings in the database.
 */
export async function savePaymentSettings(data: { keyId: string; keySecret: string; webhookSecret?: string }) {
  try {
    // Upsert key ID
    await prisma.systemSetting.upsert({
      where: { key: 'razorpay_key_id' },
      update: { value: data.keyId },
      create: { key: 'razorpay_key_id', value: data.keyId, group: 'razorpay' },
    });

    // Upsert key Secret (only if provided)
    if (data.keySecret) {
      await prisma.systemSetting.upsert({
        where: { key: 'razorpay_key_secret' },
        update: { value: data.keySecret },
        create: { key: 'razorpay_key_secret', value: data.keySecret, group: 'razorpay' },
      });
    }

    // Upsert Webhook Secret (only if provided)
    if (data.webhookSecret) {
      await prisma.systemSetting.upsert({
        where: { key: 'razorpay_webhook_secret' },
        update: { value: data.webhookSecret },
        create: { key: 'razorpay_webhook_secret', value: data.webhookSecret, group: 'razorpay' },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving payment settings:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves the public generic Key ID for the Razorpay Checkout component.
 */
export async function getPaymentPublicSettings() {
  const { keyId } = await getRazorpaySettings();
  return { keyId };
}
