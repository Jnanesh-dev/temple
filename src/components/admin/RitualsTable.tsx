'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Ritual {
  id: string
  name: string
  description: string
  suggestedDonation: number
  duration: string
  timing: string
  isActive: boolean
  order: number
}

export default function RitualsTable({ rituals }: { rituals: Ritual[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ritual?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/rituals/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete ritual')
      }
    } catch (error) {
      alert('Error deleting ritual')
    } finally {
      setDeleting(null)
    }
  }

  if (rituals.length === 0) {
    return <p className="text-gray-500 text-center py-8">No rituals found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Donation</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Timing</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rituals.map((ritual) => (
            <tr key={ritual.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{ritual.name}</td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                  {ritual.description}
                </p>
              </td>
              <td className="py-3 px-4 font-semibold text-temple-maroon">
                ₹{Number(ritual.suggestedDonation).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm">{ritual.duration}</td>
              <td className="py-3 px-4 text-sm">{ritual.timing}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ritual.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ritual.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/admin/rituals/${ritual.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ritual.id)}
                    disabled={deleting === ritual.id}
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

