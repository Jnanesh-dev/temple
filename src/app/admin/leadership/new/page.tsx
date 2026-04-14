'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import LeadershipForm from '@/components/admin/LeadershipForm'

export default function NewLeaderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/leadership" 
          className="flex items-center text-sm text-gray-500 hover:text-temple-maroon transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Leadership List
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Add New Leader
        </h1>
        <p className="text-gray-600">Create a new leadership profile for the temple</p>
      </div>

      <LeadershipForm />
    </div>
  )
}

