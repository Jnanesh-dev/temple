import Razorpay from 'razorpay';
import { prisma } from './prisma';

/**
 * Fetches Razorpay credentials from the database.
 * If not found in DB, falls back to environment variables.
 */
export async function getRazorpaySettings() {
  const settings = await prisma.systemSetting.findMany({
    where: {
      group: 'razorpay',
    },
  });

  const keyId = settings.find((s) => s.key === 'razorpay_key_id')?.value || process.env.RAZORPAY_KEY_ID;
  const keySecret = settings.find((s) => s.key === 'razorpay_key_secret')?.value || process.env.RAZORPAY_KEY_SECRET;

  return { keyId, keySecret };
}

/**
 * Initializes and returns a Razorpay instance using DB-backed settings.
 */
export async function getRazorpayClient() {
  const { keyId, keySecret } = await getRazorpaySettings();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured. Please check Admin Settings.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}
