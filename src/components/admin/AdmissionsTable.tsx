'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface Admission {
  id: string
  studentName: string
  parentName: string
  email: string
  phone: string
  classInterested: string
  message: string | null
  status: string
  createdAt: Date
}

export default function AdmissionsTable({ admissions }: { admissions: Admission[] }) {
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
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

  if (admissions.length === 0) {
    return <p className="text-gray-500 text-center py-8">No admission enquiries found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Parent</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admissions.map((admission) => (
            <tr key={admission.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{admission.studentName}</td>
              <td className="py-3 px-4">{admission.parentName}</td>
              <td className="py-3 px-4">
                <div className="text-sm">{admission.email}</div>
                <div className="text-xs text-gray-500">{admission.phone}</div>
              </td>
              <td className="py-3 px-4">{admission.classInterested}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    admission.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : admission.status === 'contacted'
                      ? 'bg-yellow-100 text-yellow-700'
                      : admission.status === 'admitted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {admission.status}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(admission.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <select
                    value={admission.status}
                    onChange={(e) => updateStatus(admission.id, e.target.value)}
                    disabled={updating === admission.id}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="admitted">Admitted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Link href={`/admin/admissions/${admission.id}`}>
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

