import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, CreditCard, Info, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import RitualBookingStatusManager from '@/components/admin/RitualBookingStatusManager'

interface RitualBookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function RitualBookingDetailPage({ params }: RitualBookingDetailPageProps) {
  const { id } = await params

  const booking = await prisma.ritualBooking.findUnique({
    where: { id },
  })

  if (!booking) {
    notFound()
  }

  // Fetch ritual details since there's no explicit relation in schema
  const ritual = await prisma.ritual.findUnique({
    where: { id: booking.ritualId }
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/ritual-bookings" 
          className="flex items-center text-sm text-gray-500 hover:text-temple-maroon transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Ritual Bookings
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Ritual Booking
          </h1>
          <p className="text-gray-600">ID: {booking.id}</p>
        </div>
        <RitualBookingStatusManager id={booking.id} currentStatus={booking.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info size={18} className="mr-2 text-temple-maroon" />
                Special Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg border text-gray-800 whitespace-pre-wrap leading-relaxed">
                {booking.specialRequests || 'No special requests provided.'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard size={18} className="mr-2 text-temple-maroon" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    booking.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : booking.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-lg font-bold text-temple-maroon">₹{Number(booking.amount || 0).toLocaleString()}</p>
                </div>
                {booking.razorpayOrderId && (
                  <div className="col-span-2 pt-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Razorpay Order ID</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border truncate">{booking.razorpayOrderId}</p>
                  </div>
                )}
                {booking.razorpayPaymentId && (
                  <div className="col-span-2 pt-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Razorpay Payment ID</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border truncate">{booking.razorpayPaymentId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <User size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Devotee Name</p>
                  <p className="font-semibold text-gray-900">{booking.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <MapPin size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ritual</p>
                  <p className="font-semibold text-gray-900">{ritual?.name || 'Unknown Ritual'}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Calendar size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Preferred Date</p>
                  <p className="font-semibold text-gray-900">
                    {booking.preferredDate 
                      ? new Date(booking.preferredDate).toLocaleDateString(undefined, { dateStyle: 'long' }) 
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Clock size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Preferred Time</p>
                  <p className="font-semibold text-gray-900">{booking.preferredTime || 'Not specified'}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Mail size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                  <a href={`mailto:${booking.email}`} className="text-temple-maroon hover:underline">
                    {booking.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Phone size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone</p>
                  <a href={`tel:${booking.phone}`} className="text-gray-900 font-medium hover:underline">
                    {booking.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
