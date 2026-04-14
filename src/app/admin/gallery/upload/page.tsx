'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'

const uploadSchema = z.object({
  file: z.any().refine((file) => file?.length > 0, 'File is required'),
  category: z.string().min(1, 'Category is required'),
  altText: z.string().optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

const categories = [
  { value: 'temple', label: 'Temple' },
  { value: 'festivals', label: 'Festivals' },
  { value: 'devotees', label: 'Devotees' },
  { value: 'school', label: 'School' },
]

export default function UploadGalleryPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  })

  const onSubmit = async (data: UploadFormData) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', data.file[0])
      formData.append('folder', 'public/gallery')

      // Upload to MinIO
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }

      const { url, fileName } = await uploadRes.json()

      // Save to database
      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: url,
          fileName,
          category: data.category,
          altText: data.altText,
        }),
      })

      if (saveRes.ok) {
        router.push('/admin/gallery')
      } else {
        alert('Failed to save image')
      }
    } catch (error) {
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Upload Gallery Image
        </h1>
        <p className="text-gray-600">Upload a new image to the gallery</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Details</CardTitle>
          <CardDescription>Select an image and provide details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Image File *
              </label>
              <Input id="file" type="file" accept=".jpg,.jpeg,.png,.gif,.webp" {...register('file')} />
              {errors.file && (
                <p className="text-red-600 text-sm mt-1">{errors.file.message as string}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <Select
                id="category"
                {...register('category')}
                options={[
                  { value: '', label: 'Select category' },
                  ...categories,
                ]}
              />
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="altText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alt Text (for accessibility)
              </label>
              <Textarea
                id="altText"
                {...register('altText')}
                placeholder="Describe the image"
                rows={2}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
