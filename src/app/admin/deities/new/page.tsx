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

const deitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  festivals: z.string(),
  specialDays: z.string(),
  imageUrl: z.string().optional(),
  order: z.number().default(0),
})

type DeityFormData = z.infer<typeof deitySchema>

export default function NewDeityPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeityFormData>({
    resolver: zodResolver(deitySchema),
  })

  const onSubmit = async (data: DeityFormData) => {
    setSubmitting(true)
    try {
      const festivals = data.festivals.split(',').map((f) => f.trim()).filter(Boolean)
      const specialDays = data.specialDays.split(',').map((d) => d.trim()).filter(Boolean)

      const res = await fetch('/api/admin/deities', {
        method: 'POST',
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
        alert('Failed to create deity')
      }
    } catch (error) {
      alert('Error creating deity')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Add New Deity
        </h1>
        <p className="text-gray-600">Create a new deity entry</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deity Details</CardTitle>
          <CardDescription>Fill in the information for the new deity</CardDescription>
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
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple festivals with commas
              </p>
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
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple days with commas
              </p>
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URL
              </label>
              <Input
                id="imageUrl"
                {...register('imageUrl')}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload image to gallery first, then paste URL here
              </p>
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <Input
                id="order"
                type="number"
                {...register('order', { valueAsNumber: true })}
                defaultValue={0}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Deity'}
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

