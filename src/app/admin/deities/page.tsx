import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DeitiesTable from '@/components/admin/DeitiesTable'

export default async function AdminDeitiesPage() {
  const deities = await prisma.deity.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Deities Management
          </h1>
          <p className="text-gray-600">Manage temple deities information</p>
        </div>
        <Link href="/admin/deities/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add New Deity
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deities</CardTitle>
        </CardHeader>
        <CardContent>
          <DeitiesTable deities={deities} />
        </CardContent>
      </Card>
    </div>
  )
}

