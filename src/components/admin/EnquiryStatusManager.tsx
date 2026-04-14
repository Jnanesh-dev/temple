'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { CheckCircle, Clock, MessageSquare, RotateCcw } from 'lucide-react'

interface EnquiryStatusManagerProps {
  id: string
  currentStatus: string
}

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  read: { label: 'Read', color: 'bg-gray-100 text-gray-700', icon: MessageSquare },
  replied: { label: 'Replied', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  resolved: { label: 'Resolved', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
}

export default function EnquiryStatusManager({ id, currentStatus }: EnquiryStatusManagerProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
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

      {currentStatus !== 'read' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('read')}
          disabled={updating}
        >
          Mark Read
        </Button>
      )}

      {currentStatus !== 'replied' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('replied')}
          disabled={updating}
        >
          Mark Replied
        </Button>
      )}

      {currentStatus !== 'resolved' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('resolved')}
          disabled={updating}
        >
          Mark Resolved
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
