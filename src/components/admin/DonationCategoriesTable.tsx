'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Category {
  id: string
  name: string
  description: string
  isActive: boolean
  order: number
}

export default function DonationCategoriesTable({
  categories,
}: {
  categories: Category[]
}) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/donation-categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      alert('Error deleting category')
    } finally {
      setDeleting(null)
    }
  }

  if (categories.length === 0) {
    return <p className="text-gray-500 text-center py-8">No categories found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{category.name}</td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-600 max-w-md">{category.description}</p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    category.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/admin/donation-categories/${category.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={deleting === category.id}
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

