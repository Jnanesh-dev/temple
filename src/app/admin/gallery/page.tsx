import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import GalleryTable from '@/components/admin/GalleryTable'

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Gallery Management
          </h1>
          <p className="text-gray-600">Manage temple and school gallery images</p>
        </div>
        <Link href="/admin/gallery/upload">
          <Button>
            <Plus size={20} className="mr-2" />
            Upload Image
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Images</CardTitle>
        </CardHeader>
        <CardContent>
          <GalleryTable images={images} />
        </CardContent>
      </Card>
    </div>
  )
}

