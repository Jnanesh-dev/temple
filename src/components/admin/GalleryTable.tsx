'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

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

  if (images.length === 0) {
    return <p className="text-gray-500 text-center py-8">No images found</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 bg-gray-100">
            <Image
              src={image.fileUrl}
              alt={image.altText || image.fileName}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-temple-gold-light text-temple-maroon rounded text-xs">
                {image.category}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(image.id)}
                disabled={deleting === image.id}
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </div>
            <p className="text-sm font-medium truncate">{image.fileName}</p>
            {image.altText && (
              <p className="text-xs text-gray-500 mt-1">{image.altText}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

