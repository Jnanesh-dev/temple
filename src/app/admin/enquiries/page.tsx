import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import EnquiriesTable from '@/components/admin/EnquiriesTable'

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    replied: enquiries.filter((e) => e.status === 'replied').length,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Contact Enquiries
        </h1>
        <p className="text-gray-600">Manage all contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-temple-maroon">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Enquiries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-sm text-gray-600">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            <p className="text-sm text-gray-600">Replied</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <EnquiriesTable enquiries={enquiries} />
        </CardContent>
      </Card>
    </div>
  )
}

