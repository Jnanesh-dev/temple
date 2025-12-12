'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Deity {
  id: string
  name: string
  description: string
  festivals: string[]
  specialDays: string[]
  imageUrl: string | null
  order: number
}

export default function DeitiesTable({ deities }: { deities: Deity[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deity?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/deities/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete deity')
      }
    } catch (error) {
      alert('Error deleting deity')
    } finally {
      setDeleting(null)
    }
  }

  if (deities.length === 0) {
    return <p className="text-gray-500 text-center py-8">No deities found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Festivals</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Special Days</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deities.map((deity) => (
            <tr key={deity.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                {deity.imageUrl ? (
                  <div className="w-16 h-16 relative rounded overflow-hidden">
                    <Image
                      src={deity.imageUrl}
                      alt={deity.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-temple-off-white rounded flex items-center justify-center">
                    <span className="text-temple-maroon text-xl font-serif">
                      {deity.name.charAt(0)}
                    </span>
                  </div>
                )}
              </td>
              <td className="py-3 px-4 font-medium">{deity.name}</td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                  {deity.description}
                </p>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  {deity.festivals.join(', ')}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  {deity.specialDays.join(', ')}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/admin/deities/${deity.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(deity.id)}
                    disabled={deleting === deity.id}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

