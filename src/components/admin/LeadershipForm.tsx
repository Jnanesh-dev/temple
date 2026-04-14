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
import Link from 'next/link'

const leadershipSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  designation: z.string().min(1, 'Designation is required').max(200),
  role: z.string().min(1, 'Role is required').max(100),
  bio: z.string().min(1, 'Bio is required').max(20000),
  message: z.string().max(5000).optional().nullable(),
  imageUrl: z.string().url('Invalid URL format').optional().nullable().or(z.literal('')),
  order: z.preprocess((val) => Number(val), z.number().int().min(0).default(0)),
})

type LeadershipFormData = z.infer<typeof leadershipSchema>

interface LeadershipFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function LeadershipForm({ initialData, isEditing = false }: LeadershipFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadershipFormData>({
    resolver: zodResolver(leadershipSchema),
    defaultValues: initialData ? {
      ...initialData,
      imageUrl: initialData.imageUrl || '',
      message: initialData.message || '',
    } : {
      order: 0,
    }
  })

  const onSubmit = async (data: LeadershipFormData) => {
    setSubmitting(true)
    try {
      const url = isEditing 
        ? `/api/admin/leadership/${initialData.id}` 
        : '/api/admin/leadership'
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/leadership')
        router.refresh()
      } else {
        const errorData = await res.json()
        alert(`Failed to ${isEditing ? 'update' : 'create'} leader: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} leader`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit' : 'New'} Leader Information</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the details for this leadership profile' : 'Enter details for the new leadership profile'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input id="name" {...register('name')} placeholder="e.g. Swami Jitakamananda" />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <Input id="designation" {...register('designation')} placeholder="e.g. Adhyaksha" />
              {errors.designation && (
                <p className="text-red-600 text-sm mt-1">{errors.designation.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <Input id="role" {...register('role')} placeholder="e.g. President" />
              {errors.role && (
                <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <Input id="order" type="number" {...register('order')} placeholder="0" />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              {errors.order && (
                <p className="text-red-600 text-sm mt-1">{errors.order.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <Input 
              id="imageUrl" 
              {...register('imageUrl')} 
              placeholder="https://example.com/image.jpg" 
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload image to gallery first, then paste URL here
            </p>
            {errors.imageUrl && (
              <p className="text-red-600 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography *
            </label>
            <Textarea 
              id="bio" 
              {...register('bio')} 
              placeholder="Write a brief biography..." 
              rows={6}
            />
            {errors.bio && (
              <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Personal Message (Optional)
            </label>
            <Textarea 
              id="message" 
              {...register('message')} 
              placeholder="A quote or message from the leader..." 
              rows={3}
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" disabled={submitting}>
              {submitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Profile' : 'Create Profile')}
            </Button>
            <Link href="/admin/leadership">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
