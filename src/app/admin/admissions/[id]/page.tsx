import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, BookOpen, Calendar, Info } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import AdmissionStatusManager from '@/components/admin/AdmissionStatusManager'

interface AdmissionDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdmissionDetailPage({ params }: AdmissionDetailPageProps) {
  const { id } = await params

  const admission = await prisma.admissionEnquiry.findUnique({
    where: { id },
  })

  if (!admission) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/admissions" 
          className="flex items-center text-sm text-gray-500 hover:text-temple-maroon transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Admission Enquiries
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Admission Application
          </h1>
          <p className="text-gray-600">ID: {admission.id}</p>
        </div>
        <AdmissionStatusManager id={admission.id} currentStatus={admission.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info size={18} className="mr-2 text-temple-maroon" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Message or Comments</h3>
                <div className="bg-gray-50 p-6 rounded-lg border text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {admission.message || 'No additional message provided.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <User size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Student Name</p>
                  <p className="font-semibold text-gray-900">{admission.studentName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <User size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Parent Name</p>
                  <p className="font-semibold text-gray-900">{admission.parentName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <BookOpen size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Class Interested</p>
                  <p className="font-semibold text-gray-900">{admission.classInterested}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Mail size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                  <a href={`mailto:${admission.email}`} className="text-temple-maroon hover:underline">
                    {admission.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Phone size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone</p>
                  <a href={`tel:${admission.phone}`} className="text-gray-900 font-medium hover:underline">
                    {admission.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-temple-off-white rounded mr-3">
                  <Calendar size={16} className="text-temple-maroon" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Applied On</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(admission.createdAt).toLocaleString(undefined, {
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
