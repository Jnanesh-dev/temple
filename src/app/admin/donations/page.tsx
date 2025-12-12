import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import DonationsTable from '@/components/admin/DonationsTable'

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: donations.length,
    completed: donations.filter((d) => d.paymentStatus === 'completed').length,
    pending: donations.filter((d) => d.paymentStatus === 'pending').length,
    totalAmount: donations
      .filter((d) => d.paymentStatus === 'completed')
      .reduce((sum, d) => sum + Number(d.amount), 0),
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Donations Management
        </h1>
        <p className="text-gray-600">View and manage all donations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-temple-maroon">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-temple-maroon">
              ₹{stats.totalAmount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Amount</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <DonationsTable donations={donations} />
        </CardContent>
      </Card>
    </div>
  )
}

