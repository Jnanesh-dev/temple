import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'
import minioClient from '@/lib/minio'

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'temple-assets'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ objectPath: string[] }> }
) {
  try {
    const { objectPath } = await params
    const objectName = objectPath.map((segment) => decodeURIComponent(segment)).join('/')

    if (!objectName.startsWith('public/')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const stat = await minioClient.statObject(BUCKET_NAME, objectName)
    const stream = await minioClient.getObject(BUCKET_NAME, objectName)
    const webStream = Readable.toWeb(stream as unknown as Readable)

    const headers = new Headers()
    headers.set(
      'Content-Type',
      stat.metaData?.['content-type'] || stat.metaData?.['Content-Type'] || 'application/octet-stream'
    )
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    if (typeof stat.size === 'number') {
      headers.set('Content-Length', stat.size.toString())
    }

    if (stat.etag) {
      headers.set('ETag', stat.etag)
    }

    if (stat.lastModified) {
      headers.set('Last-Modified', new Date(stat.lastModified).toUTCString())
    }

    return new Response(webStream as unknown as BodyInit, { headers })
  } catch (error) {
    console.error('Failed to serve file from MinIO:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
