import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DonationCategoriesTable from '@/components/admin/DonationCategoriesTable'

export default async function AdminDonationCategoriesPage() {
  const categories = await prisma.donationCategory.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Donation Categories
          </h1>
          <p className="text-gray-600">Manage donation categories</p>
        </div>
        <Link href="/admin/donation-categories/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add New Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <DonationCategoriesTable categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}

