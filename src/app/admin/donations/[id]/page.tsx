import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, Calendar, CreditCard, Info, Heart } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface DonationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function DonationDetailPage({ params }: DonationDetailPageProps) {
  const { id } = await params

  const donation = await prisma.donation.findUnique({
    where: { id },
  })

  if (!donation) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/donations" 
          className="flex items-center text-sm text-gray-500 hover:text-temple-maroon transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Donations
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Donation Record
          </h1>
          <p className="text-gray-600">ID: {donation.id}</p>
        </div>
        <div className={`flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
          donation.paymentStatus === 'completed' 
            ? 'bg-green-100 text-green-700' 
            : donation.paymentStatus === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
        }`}>
          {donation.paymentStatus}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart size={18} className="mr-2 text-temple-maroon" />
                Donation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Purpose</p>
                  <p className="text-lg font-semibold text-gray-900">{donation.purpose}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-2xl font-bold text-temple-maroon">₹{Number(donation.amount).toLocaleString()}</p>
                </div>
                {donation.categoryName && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Category</p>
                    <span className="px-2 py-1 bg-temple-gold-light text-temple-maroon rounded text-xs font-semibold">
                      {donation.categoryName}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Frequency</p>
                  <p className="text-gray-900 font-medium capitalize">{donation.frequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard size={18} className="mr-2 text-temple-maroon" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Payment ID</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border truncate">{donation.paymentId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Transaction ID</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border truncate">{donation.transactionId || 'N/A'}</p>
                  </div>
                </div>
                
                {donation.razorpayOrderId && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Razorpay Order ID</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border">{donation.razorpayOrderId}</p>
                  </div>
                )}
                
                {donation.receiptUrl && (
                  <div className="pt-2">
                    <a 
                      href={donation.receiptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-temple-maroon hover:underline font-medium flex items-center"
                    >
                      <Info size={16} className="mr-1" /> View Receipt
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <User size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Donor Name</p>
                  <p className="font-semibold text-gray-900">{donation.donorName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Mail size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                  <a href={`mailto:${donation.donorEmail}`} className="text-temple-maroon hover:underline">
                    {donation.donorEmail}
                  </a>
                </div>
              </div>

              {donation.donorPhone && (
                <div className="flex items-start">
                  <div className="p-2 bg-temple-off-white rounded mr-3">
                    <Phone size={16} className="text-temple-maroon" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone</p>
                    <a href={`tel:${donation.donorPhone}`} className="text-gray-900 font-medium hover:underline">
                      {donation.donorPhone}
                    </a>
                  </div>
                </div>
              )}

              <div className="h-px bg-gray-100 my-2" />

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Calendar size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Donated On</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(donation.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              {donation.donorAddress && (
                <div className="flex items-start pt-2">
                  <div className="p-2 bg-temple-off-white rounded mr-3">
                    <Info size={16} className="text-temple-maroon" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Address</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1 leading-snug">
                      {donation.donorAddress}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
