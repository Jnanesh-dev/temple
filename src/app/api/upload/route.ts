import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/minio'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { unlink } from 'fs/promises'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'public'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${originalName}`

    // Upload to MinIO
    const fileUrl = await uploadFile(
      buffer,
      fileName,
      file.type,
      folder
    )

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

