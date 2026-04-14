import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  DollarSign,
  Mail,
  GraduationCap,
  Calendar,
} from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  // Get statistics
  const [
    totalDonations,
    pendingDonations,
    totalEnquiries,
    newEnquiries,
    totalAdmissions,
    pendingAdmissions,
    upcomingEvents,
  ] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { paymentStatus: 'pending' } }),
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.count({ where: { status: 'new' } }),
    prisma.admissionEnquiry.count(),
    prisma.admissionEnquiry.count({ where: { status: 'new' } }),
    prisma.event.count({
      where: {
        eventDate: {
          gte: new Date(),
        },
      },
    }),
  ])

  const stats = [
    {
      title: 'Total Donations',
      value: totalDonations,
      change: `${pendingDonations} pending`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Contact Enquiries',
      value: totalEnquiries,
      change: `${newEnquiries} new`,
      icon: Mail,
      color: 'text-blue-600',
    },
    {
      title: 'Admission Enquiries',
      value: totalAdmissions,
      change: `${pendingAdmissions} pending`,
      icon: GraduationCap,
      color: 'text-purple-600',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents,
      change: 'Scheduled',
      icon: Calendar,
      color: 'text-orange-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name || 'Admin'}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-temple-maroon mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentDonations />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentEnquiries />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function RecentDonations() {
  const donations = await prisma.donation.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      donorName: true,
      amount: true,
      paymentStatus: true,
      createdAt: true,
    },
  })

  if (donations.length === 0) {
    return <p className="text-gray-500 text-sm">No donations yet</p>
  }

  return (
    <div className="space-y-3">
      {donations.map((donation: any) => (
        <div key={donation.id} className="flex items-center justify-between pb-3 border-b last:border-0">
          <div>
            <p className="font-medium text-sm">{donation.donorName}</p>
            <p className="text-xs text-gray-500">
              {new Date(donation.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-temple-maroon">
              ₹{Number(donation.amount).toLocaleString()}
            </p>
            <span
              className={`text-xs px-2 py-1 rounded ${donation.paymentStatus === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : donation.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
            >
              {donation.paymentStatus}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

async function RecentEnquiries() {
  const enquiries = await prisma.contactEnquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      subject: true,
      status: true,
      createdAt: true,
    },
  })

  if (enquiries.length === 0) {
    return <p className="text-gray-500 text-sm">No enquiries yet</p>
  }

  return (
    <div className="space-y-3">
      {enquiries.map((enquiry: any) => (
        <div key={enquiry.id} className="flex items-center justify-between pb-3 border-b last:border-0">
          <div>
            <p className="font-medium text-sm">{enquiry.name}</p>
            <p className="text-xs text-gray-500">{enquiry.subject}</p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${enquiry.status === 'new'
                ? 'bg-blue-100 text-blue-700'
                : enquiry.status === 'replied'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
          >
            {enquiry.status}
          </span>
        </div>
      ))}
    </div>
  )
}
