import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import AdmissionsTable from '@/components/admin/AdmissionsTable'

type AdmissionEnquiry = Awaited<ReturnType<typeof prisma.admissionEnquiry.findMany>>[0]

export default async function AdminAdmissionsPage() {
  const admissions = await prisma.admissionEnquiry.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: admissions.length,
    new: admissions.filter((a: AdmissionEnquiry) => a.status === 'new').length,
    contacted: admissions.filter((a: AdmissionEnquiry) => a.status === 'contacted').length,
    admitted: admissions.filter((a: AdmissionEnquiry) => a.status === 'admitted').length,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Admission Enquiries
        </h1>
        <p className="text-gray-600">Manage school admission enquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
            <p className="text-sm text-gray-600">Contacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.admitted}</div>
            <p className="text-sm text-gray-600">Admitted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Admission Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <AdmissionsTable admissions={admissions} />
        </CardContent>
      </Card>
    </div>
  )
}

