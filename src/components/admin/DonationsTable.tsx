'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export interface Donation {
  id: string
  donorName: string
  donorEmail: string
  amount: number
  purpose: string
  paymentStatus: string
  createdAt: Date
}

export default function DonationsTable({ donations }: { donations: Donation[] }) {
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
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

  if (donations.length === 0) {
    return <p className="text-gray-500 text-center py-8">No donations found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Purpose</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium">{donation.donorName}</div>
                <div className="text-sm text-gray-500">{donation.donorEmail}</div>
              </td>
              <td className="py-3 px-4 font-semibold text-temple-maroon">
                ₹{Number(donation.amount).toLocaleString()}
              </td>
              <td className="py-3 px-4">{donation.purpose}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${donation.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : donation.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                >
                  {donation.paymentStatus}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(donation.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                {donation.paymentStatus === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(donation.id, 'completed')}
                    disabled={updating === donation.id}
                  >
                    Mark Complete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

