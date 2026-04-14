import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import LeadershipForm from '@/components/admin/LeadershipForm'

interface EditLeaderPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLeaderPage({ params }: EditLeaderPageProps) {
  const { id } = await params

  const leader = await prisma.leadership.findUnique({
    where: { id },
  })

  if (!leader) {
    notFound()
  }

  // Convert Decimal/Date to plain objects for client component
  const initialData = {
    ...leader,
    order: Number(leader.order),
  }

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
          Edit Leader Profile
        </h1>
        <p className="text-gray-600">Update the profile for {leader.name}</p>
      </div>

      <LeadershipForm initialData={initialData} isEditing={true} />
    </div>
  )
}
