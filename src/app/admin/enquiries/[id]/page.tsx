import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, Tag, Info } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import EnquiryStatusManager from '@/components/admin/EnquiryStatusManager'

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const { id } = await params

  const enquiry = await prisma.contactEnquiry.findUnique({
    where: { id },
  })

  if (!enquiry) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/enquiries" 
          className="flex items-center text-sm text-gray-500 hover:text-temple-maroon transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Enquiries
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Enquiry Detail
          </h1>
          <p className="text-gray-600">ID: {enquiry.id}</p>
        </div>
        <EnquiryStatusManager id={enquiry.id} currentStatus={enquiry.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info size={18} className="mr-2 text-temple-maroon" />
                Message Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{enquiry.subject}</h3>
                <div className="bg-gray-50 p-6 rounded-lg border text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {enquiry.message}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sender Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Mail size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Name</p>
                  <p className="font-semibold text-gray-900">{enquiry.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Mail size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                  <a href={`mailto:${enquiry.email}`} className="text-temple-maroon hover:underline">
                    {enquiry.email}
                  </a>
                </div>
              </div>

              {enquiry.phone && (
                <div className="flex items-start">
                  <div className="p-2 bg-temple-off-white rounded mr-3">
                    <Phone size={16} className="text-temple-maroon" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone</p>
                    <a href={`tel:${enquiry.phone}`} className="text-gray-900 font-medium hover:underline">
                      {enquiry.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Tag size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Type</p>
                  <span className="inline-block px-2 py-0.5 bg-temple-gold-light text-temple-maroon rounded text-xs font-semibold mt-1">
                    {enquiry.enquiryType}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Calendar size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Received On</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(enquiry.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
