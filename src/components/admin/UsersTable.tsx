'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

export default function UsersTable({ users }: { users: User[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      alert('Error deleting user')
    } finally {
      setDeleting(null)
    }
  }

  if (users.length === 0) {
    return <p className="text-gray-500 text-center py-8">No users found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-temple-gold-light text-temple-maroon rounded text-xs">
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  disabled={deleting === user.id}
                >
                  <Trash2 size={16} className="text-red-600" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

