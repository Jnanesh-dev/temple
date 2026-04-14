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
import Select from '@/components/ui/Select'
import AdminImageUploadField from '@/components/admin/AdminImageUploadField'

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

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  })
  const bannerUrl = useWatch({ control, name: 'bannerUrl' })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/admin/events/${eventId}`)
        if (res.ok) {
          const { event } = await res.json()
          setValue('title', event.title)
          setValue('description', event.description || '')
          setValue('eventDate', new Date(event.eventDate).toISOString().split('T')[0])
          setValue('eventTime', event.eventTime || '')
          setValue('eventType', event.eventType)
          setValue('bannerUrl', event.bannerUrl || '')
        }
      } catch (error) {
        alert('Error loading event')
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId, setValue])

  const onSubmit = async (data: EventFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/events')
      } else {
        alert('Failed to update event')
      }
    } catch (error) {
      alert('Error updating event')
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
          Edit Event
        </h1>
        <p className="text-gray-600">Update event information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Update the event information</CardDescription>
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

            <input type="hidden" {...register('bannerUrl')} />
            <AdminImageUploadField
              label="Banner Image"
              value={bannerUrl}
              onChange={(url) =>
                setValue('bannerUrl', url, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder="public/events"
              helpText="Upload a new banner image from your computer or keep the current one."
              previewClassName="aspect-video"
              onUploadingChange={setUploadingImage}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting || uploadingImage}>
                {submitting ? 'Updating...' : 'Update Event'}
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
