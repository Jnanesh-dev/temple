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

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  bannerUrl: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

const eventTypes = [
  { value: 'festival', label: 'Festival' },
  { value: 'satsang', label: 'Satsang' },
  { value: 'special-pooja', label: 'Special Pooja' },
  { value: 'other', label: 'Other' },
]

export default function NewEventPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  })

  const onSubmit = async (data: EventFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/events')
      } else {
        alert('Failed to create event')
      }
    } catch (error) {
      alert('Error creating event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Add New Event
        </h1>
        <p className="text-gray-600">Create a new temple event or festival</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Fill in the information for the new event</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input id="title" {...register('title')} placeholder="Event title" />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Event description"
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Date *
                </label>
                <Input id="eventDate" type="date" {...register('eventDate')} />
                {errors.eventDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.eventDate.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="eventTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Time
                </label>
                <Input id="eventTime" type="time" {...register('eventTime')} />
              </div>
            </div>

            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Type *
              </label>
              <Select
                id="eventType"
                {...register('eventType')}
                options={[
                  { value: '', label: 'Select event type' },
                  ...eventTypes,
                ]}
              />
              {errors.eventType && (
                <p className="text-red-600 text-sm mt-1">{errors.eventType.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="bannerUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Banner Image URL
              </label>
              <Input
                id="bannerUrl"
                {...register('bannerUrl')}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload image to gallery first, then paste URL here
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

