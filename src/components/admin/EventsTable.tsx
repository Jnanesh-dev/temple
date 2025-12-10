'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Event {
  id: string
  title: string
  description: string | null
  eventDate: Date
  eventTime: string | null
  eventType: string
  bannerUrl: string | null
  createdAt: Date
}

export default function EventsTable({ events }: { events: Event[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete event')
      }
    } catch (error) {
      alert('Error deleting event')
    } finally {
      setDeleting(null)
    }
  }

  if (events.length === 0) {
    return <p className="text-gray-500 text-center py-8">No events found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium">{event.title}</div>
                {event.description && (
                  <div className="text-sm text-gray-500 truncate max-w-md">
                    {event.description}
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                <div>{new Date(event.eventDate).toLocaleDateString()}</div>
                {event.eventTime && (
                  <div className="text-sm text-gray-500">{event.eventTime}</div>
                )}
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-temple-gold-light text-temple-maroon rounded text-sm">
                  {event.eventType}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    disabled={deleting === event.id}
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

