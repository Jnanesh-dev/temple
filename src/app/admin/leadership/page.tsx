import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import LeadershipTable from '@/components/admin/LeadershipTable'

export default async function AdminLeadershipPage() {
  const leadership = await prisma.leadership.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Leadership Management
          </h1>
          <p className="text-gray-600">Manage leadership profiles</p>
        </div>
        <Link href="/admin/leadership/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add New Leader
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leadership</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadershipTable leadership={leadership} />
        </CardContent>
      </Card>
    </div>
  )
}

