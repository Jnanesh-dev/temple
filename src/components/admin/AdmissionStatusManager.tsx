'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { CheckCircle, Clock, Phone, UserMinus, RotateCcw } from 'lucide-react'

interface AdmissionStatusManagerProps {
  id: string
  currentStatus: string
}

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700', icon: Phone },
  admitted: { label: 'Admitted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: UserMinus },
}

export default function AdmissionStatusManager({ id, currentStatus }: AdmissionStatusManagerProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    } finally {
      setUpdating(false)
    }
  }

  const current = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.new

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mr-2 ${current.color}`}>
        <current.icon size={16} className="mr-1.5" />
        {current.label}
      </div>

      <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />

      {currentStatus !== 'contacted' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('contacted')}
          disabled={updating}
        >
          Mark Contacted
        </Button>
      )}

      {currentStatus !== 'admitted' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('admitted')}
          disabled={updating}
        >
          Admit Student
        </Button>
      )}

      {currentStatus !== 'rejected' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('rejected')}
          disabled={updating}
        >
          Reject
        </Button>
      )}

      {currentStatus !== 'new' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('new')}
          disabled={updating}
          title="Reset to New"
        >
          <RotateCcw size={14} />
        </Button>
      )}
    </div>
  )
}
