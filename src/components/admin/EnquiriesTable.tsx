'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Enquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  enquiryType: string
  status: string
  createdAt: Date
}

export default function EnquiriesTable({ enquiries }: { enquiries: Enquiry[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
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

  if (enquiries.length === 0) {
    return <p className="text-gray-500 text-center py-8">No enquiries found</p>
  }

  return (
    <div className="space-y-4">
      {enquiries.map((enquiry) => (
        <div key={enquiry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">{enquiry.name}</h3>
                <span className="px-2 py-1 bg-temple-gold-light text-temple-maroon rounded text-xs">
                  {enquiry.enquiryType}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    enquiry.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : enquiry.status === 'replied'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {enquiry.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{enquiry.email}</p>
              <p className="font-medium mb-2">{enquiry.subject}</p>
              {selected === enquiry.id ? (
                <div>
                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                    {enquiry.message}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(null)}
                  >
                    Show Less
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {enquiry.message}
                </p>
              )}
              {selected !== enquiry.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(enquiry.id)}
                >
                  Read More
                </Button>
              )}
            </div>
            <div className="ml-4 flex flex-col gap-2">
              {enquiry.status === 'new' && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(enquiry.id, 'replied')}
                  disabled={updating === enquiry.id}
                >
                  Mark Replied
                </Button>
              )}
              <span className="text-xs text-gray-500">
                {new Date(enquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

