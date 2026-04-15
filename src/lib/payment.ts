import Razorpay from 'razorpay';
import { prisma } from './prisma';
import {
  decryptSettingValue,
  encryptSettingValue,
  isEncryptedSettingValue,
} from './secureSettings';

type SettingLike = {
  key: string
  value: string
}

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

  const findSettingValue = (key: string) =>
    settings.find((setting: SettingLike) => setting.key === key)?.value;

  const keyId = findSettingValue('razorpay_key_id') || process.env.RAZORPAY_KEY_ID;
  let storedKeySecret = findSettingValue('razorpay_key_secret');
  let storedWebhookSecret = findSettingValue('razorpay_webhook_secret');

  if (
    storedKeySecret &&
    process.env.SETTINGS_ENCRYPTION_KEY &&
    !isEncryptedSettingValue(storedKeySecret)
  ) {
    storedKeySecret = encryptSettingValue(storedKeySecret);
    await prisma.systemSetting.update({
      where: { key: 'razorpay_key_secret' },
      data: { value: storedKeySecret },
    });
  }

  if (
    storedWebhookSecret &&
    process.env.SETTINGS_ENCRYPTION_KEY &&
    !isEncryptedSettingValue(storedWebhookSecret)
  ) {
    storedWebhookSecret = encryptSettingValue(storedWebhookSecret);
    await prisma.systemSetting.update({
      where: { key: 'razorpay_webhook_secret' },
      data: { value: storedWebhookSecret },
    });
  }

  const keySecret = storedKeySecret
    ? decryptSettingValue(storedKeySecret)
    : process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = storedWebhookSecret
    ? decryptSettingValue(storedWebhookSecret)
    : process.env.RAZORPAY_WEBHOOK_SECRET;

  return { keyId, keySecret, webhookSecret };
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

export async function getRazorpayWebhookSecret() {
  const { webhookSecret } = await getRazorpaySettings();
  return webhookSecret;
}
