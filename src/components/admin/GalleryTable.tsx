'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface GalleryImage {
  id: string
  fileUrl: string
  fileName: string
  category: string
  altText: string | null
  createdAt: Date
}

export default function GalleryTable({ images }: { images: GalleryImage[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [edgeAltText, setEdgeAltText] = useState('')
  const [saving, setSaving] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      alert('Error deleting image')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditing(image.id)
    setEdgeAltText(image.altText || '')
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ altText: edgeAltText }),
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to update alt text')
      }
    } catch (error) {
      alert('Error updating alt text')
    } finally {
      setSaving(false)
      setEditing(null)
    }
  }

  if (images.length === 0) {
    return <p className="text-gray-500 text-center py-8">No images found</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div key={image.id} className="border rounded-xl border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="relative h-56 bg-gray-50 overflow-hidden">
            <Image
              src={image.fileUrl}
              alt={image.altText || image.fileName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm text-temple-maroon rounded-full text-[10px] font-bold uppercase tracking-wider">
                {image.category}
              </span>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur h-8 w-8 p-0 min-w-0 border-none hover:bg-white"
                onClick={() => handleDelete(image.id)}
                disabled={deleting === image.id}
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-900 truncate mb-1">{image.fileName}</p>
              <p className="text-[10px] text-gray-400 font-medium">Added on {new Date(image.createdAt).toLocaleDateString()}</p>
            </div>
            
            {editing === image.id ? (
              <div className="space-y-3">
                <Input
                  value={edgeAltText}
                  onChange={(e) => setEdgeAltText(e.target.value)}
                  placeholder="Alt text (SEO & Accessibility)"
                  className="text-sm py-1 h-8"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="h-7 py-0 px-3 text-xs"
                    onClick={() => handleSave(image.id)}
                    disabled={saving}
                  >
                    <Check size={14} className="mr-1" /> Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 py-0 px-3 text-xs border-gray-200"
                    onClick={() => setEditing(null)}
                    disabled={saving}
                  >
                    <X size={14} className="mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 italic line-clamp-2 min-h-[2rem]">
                    {image.altText ? `"${image.altText}"` : <span className="text-gray-300">No alt text provided...</span>}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-gray-200 hover:border-temple-maroon hover:text-temple-maroon"
                  onClick={() => handleEdit(image)}
                >
                  <Edit2 size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}


