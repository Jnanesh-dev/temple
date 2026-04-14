'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || d.paymentStatus === statusFilter

    return matchesSearch && matchesStatus
  })

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by donor name, email or purpose..."
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-temple-maroon/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-48">
          <select
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-temple-maroon/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No matching records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Purpose</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{donation.donorName}</div>
                    <div className="text-xs text-gray-500">{donation.donorEmail}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-temple-maroon">
                    ₹{Number(donation.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">
                    {donation.purpose}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${donation.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : donation.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {donation.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {donation.paymentStatus === 'pending' && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="py-1 h-auto text-[10px]"
                          onClick={() => updateStatus(donation.id, 'completed')}
                          disabled={updating === donation.id}
                        >
                          {updating === donation.id ? 'Updating...' : 'Mark Paid'}
                        </Button>
                      )}
                      <Link href={`/admin/donations/${donation.id}`}>
                        <Button variant="outline" size="sm" className="py-1 h-auto text-[10px]">
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
      )}
    </div>
  )
}

