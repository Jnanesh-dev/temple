'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import AdminImageUploadField from '@/components/admin/AdminImageUploadField'

const deitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  festivals: z.string(),
  specialDays: z.string(),
  imageUrl: z.string().optional(),
  order: z.number().default(0),
})

type DeityFormData = z.infer<typeof deitySchema>

export default function EditDeityPage() {
  const router = useRouter()
  const params = useParams()
  const deityId = params.id as string
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DeityFormData>({
    resolver: zodResolver(deitySchema),
  })
  const imageUrl = useWatch({ control, name: 'imageUrl' })

  useEffect(() => {
    const fetchDeity = async () => {
      try {
        const res = await fetch(`/api/admin/deities/${deityId}`)
        if (res.ok) {
          const { deity } = await res.json()
          setValue('name', deity.name)
          setValue('description', deity.description)
          setValue('festivals', deity.festivals.join(', '))
          setValue('specialDays', deity.specialDays.join(', '))
          setValue('imageUrl', deity.imageUrl || '')
          setValue('order', deity.order)
        }
      } catch (error) {
        alert('Error loading deity')
      } finally {
        setLoading(false)
      }
    }

    if (deityId) {
      fetchDeity()
    }
  }, [deityId, setValue])

  const onSubmit = async (data: DeityFormData) => {
    setSubmitting(true)
    try {
      const festivals = data.festivals.split(',').map((f) => f.trim()).filter(Boolean)
      const specialDays = data.specialDays.split(',').map((d) => d.trim()).filter(Boolean)

      const res = await fetch(`/api/admin/deities/${deityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          festivals,
          specialDays,
        }),
      })

      if (res.ok) {
        router.push('/admin/deities')
      } else {
        alert('Failed to update deity')
      }
    } catch (error) {
      alert('Error updating deity')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Edit Deity
        </h1>
        <p className="text-gray-600">Update deity information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deity Details</CardTitle>
          <CardDescription>Update the deity information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input id="name" {...register('name')} placeholder="Deity name" />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Deity description"
                rows={6}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="festivals"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Festivals (comma-separated)
              </label>
              <Input
                id="festivals"
                {...register('festivals')}
                placeholder="Navratri, Durga Puja, Vijayadashami"
              />
            </div>

            <div>
              <label
                htmlFor="specialDays"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Special Days (comma-separated)
              </label>
              <Input
                id="specialDays"
                {...register('specialDays')}
                placeholder="Every Tuesday, Every Friday"
              />
            </div>

            <input type="hidden" {...register('imageUrl')} />
            <AdminImageUploadField
              label="Deity Image"
              value={imageUrl}
              onChange={(url) =>
                setValue('imageUrl', url, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder="public/deities"
              helpText="Upload a new deity image from your computer or keep the current one."
              previewClassName="aspect-[4/5]"
              onUploadingChange={setUploadingImage}
            />

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <Input
                id="order"
                type="number"
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting || uploadingImage}>
                {submitting ? 'Updating...' : 'Update Deity'}
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
