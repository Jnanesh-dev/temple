import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import RitualsTable from '@/components/admin/RitualsTable'

export default async function AdminRitualsPage() {
  const rituals = await prisma.ritual.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Rituals & Services Management
          </h1>
          <p className="text-gray-600">Manage temple rituals and services</p>
        </div>
        <Link href="/admin/rituals/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add New Ritual
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Rituals & Services</CardTitle>
        </CardHeader>
        <CardContent>
          <RitualsTable rituals={rituals} />
        </CardContent>
      </Card>
    </div>
  )
}

