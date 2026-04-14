'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Leader {
  id: string
  name: string
  designation: string
  role: string
  bio: string
  message: string | null
  imageUrl: string | null
  order: number
}

export default function LeadershipTable({ leadership }: { leadership: Leader[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leader?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/leadership/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete leader')
      }
    } catch (error) {
      alert('Error deleting leader')
    } finally {
      setDeleting(null)
    }
  }

  if (leadership.length === 0) {
    return <p className="text-gray-500 text-center py-8">No leadership profiles found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Designation</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Bio</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leadership.map((leader) => (
            <tr key={leader.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                {leader.imageUrl ? (
                  <div className="w-16 h-16 relative rounded-full overflow-hidden">
                    <Image
                      src={leader.imageUrl}
                      alt={leader.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-temple-off-white rounded-full flex items-center justify-center">
                    <span className="text-temple-maroon text-xl font-serif">
                      {leader.name.charAt(0)}
                    </span>
                  </div>
                )}
              </td>
              <td className="py-3 px-4 font-medium">{leader.name}</td>
              <td className="py-3 px-4 text-sm text-temple-maroon">{leader.designation}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{leader.role}</td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{leader.bio}</p>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/admin/leadership/${leader.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(leader.id)}
                    disabled={deleting === leader.id}
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
