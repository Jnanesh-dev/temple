'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  ritualId: string
  preferredDate: Date | null
  preferredTime: string | null
  specialRequests: string | null
  status: string
  createdAt: Date
}

export default function RitualBookingsTable({ bookings }: { bookings: Booking[] }) {
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/ritual-bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    } finally {
      setUpdating(null)
    }
  }

  if (bookings.length === 0) {
    return <p className="text-gray-500 text-center py-8">No bookings found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Ritual</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Preferred Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{booking.name}</td>
              <td className="py-3 px-4">
                <div className="text-sm">{booking.email}</div>
                <div className="text-xs text-gray-500">{booking.phone}</div>
              </td>
              <td className="py-3 px-4 text-sm">{booking.ritualId}</td>
              <td className="py-3 px-4 text-sm">
                {booking.preferredDate
                  ? new Date(booking.preferredDate).toLocaleDateString()
                  : 'Not specified'}
                {booking.preferredTime && (
                  <div className="text-xs text-gray-500">{booking.preferredTime}</div>
                )}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : booking.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : booking.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    disabled={updating === booking.id}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Link href={`/admin/ritual-bookings/${booking.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

