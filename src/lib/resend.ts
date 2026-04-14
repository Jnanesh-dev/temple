import { Resend } from 'resend'

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY environment variable')
  }

  return new Resend(process.env.RESEND_API_KEY)
}
