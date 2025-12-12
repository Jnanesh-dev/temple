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

const ritualSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  suggestedDonation: z.string().min(1, 'Suggested donation is required'),
  duration: z.string().min(1, 'Duration is required'),
  timing: z.string().min(1, 'Timing is required'),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

type RitualFormData = z.infer<typeof ritualSchema>

export default function NewRitualPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RitualFormData>({
    resolver: zodResolver(ritualSchema),
    defaultValues: {
      isActive: true,
    },
  })

  const onSubmit = async (data: RitualFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/rituals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/rituals')
      } else {
        alert('Failed to create ritual')
      }
    } catch (error) {
      alert('Error creating ritual')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Add New Ritual
        </h1>
        <p className="text-gray-600">Create a new ritual or service</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ritual Details</CardTitle>
          <CardDescription>Fill in the information for the new ritual</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input id="name" {...register('name')} placeholder="Ritual name" />
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
                placeholder="Ritual description"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="suggestedDonation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Suggested Donation (₹) *
                </label>
                <Input
                  id="suggestedDonation"
                  type="number"
                  step="0.01"
                  {...register('suggestedDonation')}
                  placeholder="500"
                />
                {errors.suggestedDonation && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.suggestedDonation.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration *
                </label>
                <Input
                  id="duration"
                  {...register('duration')}
                  placeholder="30 minutes"
                />
                {errors.duration && (
                  <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="timing"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Timing *
              </label>
              <Input
                id="timing"
                {...register('timing')}
                placeholder="Morning: 7:00 AM, Evening: 7:00 PM"
              />
              {errors.timing && (
                <p className="text-red-600 text-sm mt-1">{errors.timing.message}</p>
              )}
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

            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                {...register('isActive')}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible on website)
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Ritual'}
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

