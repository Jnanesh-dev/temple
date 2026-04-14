'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Trash2, Plus } from 'lucide-react'
import AdminImageUploadField from './AdminImageUploadField'

const tierSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  amount: z.coerce.number().min(1, 'Amount must be at least 1'),
})

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
  tiers: z.array(tierSchema).default([]),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface DonationCategoryFormProps {
  initialData?: any
  id?: string
}

export default function DonationCategoryForm({ initialData, id }: DonationCategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      isActive: true,
      order: 0,
      tiers: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tiers',
  })
  const imageUrl = useWatch({ control, name: 'imageUrl' })

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true)
    try {
      const url = id ? `/api/admin/donation-categories/${id}` : '/api/admin/donation-categories'
      const method = id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/donation-categories')
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to save category')
      }
    } catch (error) {
      alert('An error occurred while saving')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <Input {...register('name')} placeholder="e.g., Annadan, Gau Seva" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <Textarea {...register('description')} rows={4} placeholder="Describe this donation type..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <Input type="number" {...register('order')} />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-temple-maroon rounded" />
                    <span className="text-sm font-medium text-gray-700">Active Status</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Manager */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Donation Tiers</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', amount: 0 })}>
                <Plus size={16} className="mr-1" /> Add Tier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed text-italic">
                    No tiers added yet. Users will be asked for a custom amount.
                  </p>
                )}
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <Input {...register(`tiers.${index}.label`)} placeholder="e.g., 25 Meals" />
                    </div>
                    <div className="w-32">
                      <Input type="number" {...register(`tiers.${index}.amount`)} placeholder="Amount" />
                    </div>
                    <Button type="button" variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50" onClick={() => remove(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Thumbnail */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input type="hidden" {...register('imageUrl')} />
                <AdminImageUploadField
                  label="Thumbnail Image"
                  value={imageUrl}
                  onChange={(url) =>
                    setValue('imageUrl', url, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  folder="public/donation-categories"
                  helpText="Upload a category thumbnail from your computer."
                  previewClassName="aspect-video"
                  onUploadingChange={setUploading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-temple-maroon text-white">
            <CardContent className="pt-6">
              <Button type="submit" className="w-full bg-white text-temple-maroon hover:bg-gray-100" disabled={loading || uploading}>
                {loading ? 'Saving Changes...' : id ? 'Update Category' : 'Create Category'}
              </Button>
              <Button type="button" variant="outline" className="w-full mt-2 border-white/20 text-white hover:bg-white/10" onClick={() => router.back()}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
