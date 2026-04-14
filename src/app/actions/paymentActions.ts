'use server'

import crypto from 'crypto'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getRazorpayClient, getRazorpaySettings } from '@/lib/payment'
import { requireAdmin } from '@/lib/admin'
import { sanitizeEmail, sanitizePhone, sanitizeString } from '@/lib/sanitize'
import { encryptSettingValue } from '@/lib/secureSettings'
import { sendDonationNotification } from './emailActions'

const donationOrderSchema = z.object({
  amount: z.number().finite().min(10, 'Minimum donation amount is Rs 10').max(10000000),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  purpose: z.string().min(1, 'Purpose is required').max(100),
  categoryName: z.string().max(100).optional(),
  frequency: z.enum(['one-time', 'monthly']),
  address: z.string().max(500).optional(),
})

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  donationId: z.string().uuid(),
})

const paymentSettingsSchema = z.object({
  keyId: z.string().min(1, 'Razorpay Key ID is required.').max(100),
  keySecret: z.string().max(255).default(''),
  webhookSecret: z.string().max(255).optional(),
})

function getFirstValidationError(error: z.ZodError): string {
  return error.issues[0]?.message || 'Validation failed'
}

function signaturesMatch(expectedSignature: string, providedSignature: string): boolean {
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const providedBuffer = Buffer.from(providedSignature, 'utf8')

  if (expectedBuffer.length !== providedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

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
    const validationResult = donationOrderSchema.safeParse(formData)
    if (!validationResult.success) {
      return { success: false, error: getFirstValidationError(validationResult.error) }
    }

    const data = validationResult.data
    const sanitizedName = sanitizeString(data.name)
    const sanitizedEmail = sanitizeEmail(data.email)
    const sanitizedPhone = sanitizePhone(data.phone)
    const sanitizedPurpose = sanitizeString(data.purpose)
    const sanitizedCategoryName = data.categoryName ? sanitizeString(data.categoryName) || undefined : undefined
    const sanitizedAddress = data.address ? sanitizeString(data.address) || undefined : undefined

    if (
      !sanitizedName ||
      !sanitizedEmail ||
      !sanitizedPurpose ||
      sanitizedPhone.replace(/\D/g, '').length < 10
    ) {
      return { success: false, error: 'Invalid donation details' }
    }

    const razorpay = await getRazorpayClient()

    // Create a pending donation in the DB
    const donation = await prisma.donation.create({
      data: {
        donorName: sanitizedName,
        donorEmail: sanitizedEmail,
        donorPhone: sanitizedPhone,
        donorAddress: sanitizedAddress,
        amount: data.amount,
        purpose: sanitizedPurpose,
        categoryName: sanitizedCategoryName,
        frequency: data.frequency,
        paymentStatus: 'pending',
      },
    })

    // Create Razorpay Order (amount in paise)
    const order = await razorpay.orders.create({
      amount: Math.round(data.amount * 100),
      currency: 'INR',
      receipt: donation.id,
      notes: {
        purpose: sanitizedPurpose,
        donor: sanitizedName,
      },
    })

    // Update donation with Razorpay Order ID
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        razorpayOrderId: order.id,
      },
    })

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      donationId: donation.id,
    }
  } catch (error: any) {
    console.error('Error creating donation order:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Internal helper to finalize a donation (DB update + Email).
 * Can be called by verifyPayment (frontend) or Webhook.
 */
async function markDonationAsCompleted(donationId: string, paymentId: string, signature?: string) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
  })

  if (!donation || donation.paymentStatus === 'completed') return

  await prisma.donation.update({
    where: { id: donationId },
    data: {
      paymentStatus: 'completed',
      paymentId,
      transactionId: paymentId,
      razorpaySignature: signature,
    },
  })

  try {
    await sendDonationNotification({
      name: donation.donorName,
      email: donation.donorEmail,
      phone: donation.donorPhone || '',
      address: donation.donorAddress || undefined,
      amount: Number(donation.amount),
      purpose: donation.purpose,
      frequency: donation.frequency,
    })
  } catch (emailError) {
    console.error('Failed to send donation notification email:', emailError)
  }
}

/**
 * Verifies the Razorpay payment signature and updates the donation status.
 */
export async function verifyPayment(data: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  donationId: string
}) {
  try {
    const validationResult = verifyPaymentSchema.safeParse(data)
    if (!validationResult.success) {
      return { success: false, error: getFirstValidationError(validationResult.error) }
    }

    const payload = validationResult.data
    const donation = await prisma.donation.findUnique({
      where: { id: payload.donationId },
    })

    if (!donation || donation.razorpayOrderId !== payload.razorpay_order_id) {
      return { success: false, error: 'Donation could not be verified' }
    }

    if (donation.paymentStatus === 'completed') {
      if (
        donation.paymentId === payload.razorpay_payment_id &&
        donation.razorpaySignature === payload.razorpay_signature
      ) {
        return { success: true }
      }

      return { success: false, error: 'Donation already processed' }
    }

    const { keySecret } = await getRazorpaySettings()
    if (!keySecret) throw new Error('Razorpay secret missing')

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
      .digest('hex')

    if (!signaturesMatch(generatedSignature, payload.razorpay_signature)) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: { paymentStatus: 'failed' },
      })

      return { success: false, error: 'Invalid signature' }
    }

    await markDonationAsCompleted(
      donation.id,
      payload.razorpay_payment_id,
      payload.razorpay_signature
    )

    return { success: true }
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Publicly exposed version of the completion logic for the Webhook handler.
 * Only call this after verifying the webhook signature.
 */
export async function finalizeDonationFromWebhook(donationId: string, paymentId: string) {
  await markDonationAsCompleted(donationId, paymentId)
}

/**
 * Saves or updates Razorpay settings in the database.
 */
export async function savePaymentSettings(data: {
  keyId: string
  keySecret: string
  webhookSecret?: string
}) {
  try {
    await requireAdmin()

    const validationResult = paymentSettingsSchema.safeParse({
      keyId: data.keyId?.trim(),
      keySecret: data.keySecret?.trim() || '',
      webhookSecret: data.webhookSecret?.trim() || '',
    })

    if (!validationResult.success) {
      return { success: false, error: getFirstValidationError(validationResult.error) }
    }

    const { keyId, keySecret, webhookSecret = '' } = validationResult.data
    const encryptedKeySecret = keySecret ? encryptSettingValue(keySecret) : null
    const encryptedWebhookSecret = webhookSecret ? encryptSettingValue(webhookSecret) : null

    await prisma.systemSetting.upsert({
      where: { key: 'razorpay_key_id' },
      update: { value: keyId },
      create: { key: 'razorpay_key_id', value: keyId, group: 'razorpay' },
    })

    if (encryptedKeySecret) {
      await prisma.systemSetting.upsert({
        where: { key: 'razorpay_key_secret' },
        update: { value: encryptedKeySecret },
        create: {
          key: 'razorpay_key_secret',
          value: encryptedKeySecret,
          group: 'razorpay',
        },
      })
    }

    if (encryptedWebhookSecret) {
      await prisma.systemSetting.upsert({
        where: { key: 'razorpay_webhook_secret' },
        update: { value: encryptedWebhookSecret },
        create: {
          key: 'razorpay_webhook_secret',
          value: encryptedWebhookSecret,
          group: 'razorpay',
        },
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error saving payment settings:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Retrieves the public generic Key ID for the Razorpay Checkout component.
 */
export async function getPaymentPublicSettings() {
  const { keyId } = await getRazorpaySettings()
  return { keyId }
}
