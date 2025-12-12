import * as Minio from 'minio'

// MinIO client configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'temple-assets'

// Initialize bucket if it doesn't exist
export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`✅ Created bucket: ${BUCKET_NAME}`)
      
      // Set bucket policy to allow public read access for images
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/public/*`],
          },
        ],
      }
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
    } else {
      console.log(`✅ Bucket exists: ${BUCKET_NAME}`)
    }
  } catch (error) {
    console.error('❌ MinIO bucket error:', error)
    throw error
  }
}

// Upload file to MinIO
export async function uploadFile(
  file: Buffer | string,
  fileName: string,
  contentType: string,
  folder: string = 'public'
): Promise<string> {
  try {
    await ensureBucketExists()
    
    const objectName = `${folder}/${fileName}`
    const metaData = {
      'Content-Type': contentType,
    }

    if (typeof file === 'string') {
      // If file is a path
      await minioClient.fPutObject(BUCKET_NAME, objectName, file, metaData)
    } else {
      // If file is a buffer
      await minioClient.putObject(BUCKET_NAME, objectName, file, file.length, metaData)
    }

    // Return the URL to access the file
    const url = await getFileUrl(objectName)
    return url
  } catch (error) {
    console.error('❌ MinIO upload error:', error)
    throw error
  }
}

// Alias for uploadFile (for consistency)
export async function uploadToMinIO(
  objectName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await ensureBucketExists()
  const metaData = {
    'Content-Type': contentType,
  }
  await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, metaData)
  return getFileUrl(objectName)
}

// Get file URL
export async function getFileUrl(objectName: string, expiry: number = 7 * 24 * 60 * 60): Promise<string> {
  try {
    // For public files, return direct URL
    if (objectName.startsWith('public/')) {
      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'
      const port = process.env.MINIO_PORT || '9000'
      const endpoint = process.env.MINIO_ENDPOINT || 'localhost'
      return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${objectName}`
    }
    
    // For private files, generate presigned URL
    const url = await minioClient.presignedGetObject(BUCKET_NAME, objectName, expiry)
    return url
  } catch (error) {
    console.error('❌ MinIO URL error:', error)
    throw error
  }
}

// Delete file from MinIO
export async function deleteFile(objectName: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectName)
    console.log(`✅ Deleted file: ${objectName}`)
  } catch (error) {
    console.error('❌ MinIO delete error:', error)
    throw error
  }
}

// List files in a folder
export async function listFiles(folder: string = 'public'): Promise<string[]> {
  try {
    const objectsList: string[] = []
    const objectsStream = minioClient.listObjects(BUCKET_NAME, folder, true)

    for await (const obj of objectsStream) {
      if (obj.name) {
        objectsList.push(obj.name)
      }
    }

    return objectsList
  } catch (error) {
    console.error('❌ MinIO list error:', error)
    throw error
  }
}

export default minioClient

