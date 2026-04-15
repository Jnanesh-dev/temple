const FILES_ROUTE_PREFIX = '/api/files'
const DEFAULT_BUCKET_NAME = 'temple-assets'

function stripTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000'
  )
}

function encodeObjectPath(objectName: string): string {
  return objectName
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export function buildPublicFileUrl(objectName: string): string {
  const origin = stripTrailingSlash(getSiteOrigin())
  return `${origin}${FILES_ROUTE_PREFIX}/${encodeObjectPath(objectName)}`
}

export function getObjectNameFromFileUrl(fileUrl: string): string | null {
  if (!fileUrl) {
    return null
  }

  if (fileUrl.startsWith('public/')) {
    return fileUrl
  }

  try {
    const bucketName = process.env.MINIO_BUCKET_NAME || DEFAULT_BUCKET_NAME
    const baseUrl = getSiteOrigin()
    const url = new URL(fileUrl, baseUrl)
    const apiPrefix = `${FILES_ROUTE_PREFIX}/`
    const bucketPrefix = `/${bucketName}/`

    if (url.pathname.startsWith(apiPrefix)) {
      return decodeURIComponent(url.pathname.slice(apiPrefix.length))
    }

    if (url.pathname.startsWith(bucketPrefix)) {
      return decodeURIComponent(url.pathname.slice(bucketPrefix.length))
    }
  } catch {
    return null
  }

  return null
}

export function resolveMediaUrl(fileUrl?: string | null): string | undefined {
  if (!fileUrl) {
    return undefined
  }

  const objectName = getObjectNameFromFileUrl(fileUrl)
  return objectName ? buildPublicFileUrl(objectName) : fileUrl
}
