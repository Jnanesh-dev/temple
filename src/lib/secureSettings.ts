import crypto from 'crypto'

const ENCRYPTED_VALUE_PREFIX = 'encv1'
const IV_LENGTH = 12

function getEncryptionKey(): Buffer | null {
  const rawKey = process.env.SETTINGS_ENCRYPTION_KEY

  if (!rawKey) {
    return null
  }

  return crypto.createHash('sha256').update(rawKey).digest()
}

export function encryptSettingValue(value: string): string {
  const key = getEncryptionKey()

  if (!key) {
    throw new Error(
      'SETTINGS_ENCRYPTION_KEY is required before saving encrypted payment secrets.'
    )
  }

  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [
    ENCRYPTED_VALUE_PREFIX,
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':')
}

export function isEncryptedSettingValue(value: string): boolean {
  return value.startsWith(`${ENCRYPTED_VALUE_PREFIX}:`)
}

export function decryptSettingValue(value: string): string {
  if (!isEncryptedSettingValue(value)) {
    return value
  }

  const key = getEncryptionKey()

  if (!key) {
    throw new Error(
      'SETTINGS_ENCRYPTION_KEY is required before reading encrypted payment secrets.'
    )
  }

  const parts = value.split(':')

  if (parts.length !== 4) {
    throw new Error('Stored encrypted payment setting is malformed.')
  }

  const [, ivPart, authTagPart, encryptedPart] = parts
  const iv = Buffer.from(ivPart, 'base64url')
  const authTag = Buffer.from(authTagPart, 'base64url')
  const encrypted = Buffer.from(encryptedPart, 'base64url')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)

  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}
