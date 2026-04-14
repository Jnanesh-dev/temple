'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react'

interface RitualBookingStatusManagerProps {
  id: string
  currentStatus: string
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function RitualBookingStatusManager({ id, currentStatus }: RitualBookingStatusManagerProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/ritual-bookings/${id}`, {
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

  const current = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mr-2 ${current.color}`}>
        <current.icon size={16} className="mr-1.5" />
        {current.label}
      </div>

      <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />

      {currentStatus !== 'confirmed' && currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('confirmed')}
          disabled={updating}
        >
          Confirm
        </Button>
      )}

      {currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('completed')}
          disabled={updating}
        >
          Mark Completed
        </Button>
      )}

      {currentStatus !== 'cancelled' && currentStatus !== 'completed' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('cancelled')}
          disabled={updating}
        >
          Cancel
        </Button>
      )}

      {(currentStatus === 'cancelled' || currentStatus === 'completed') && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('pending')}
          disabled={updating}
          title="Reset to Pending"
        >
          <RotateCcw size={14} />
        </Button>
      )}
    </div>
  )
}
