import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DonationCategoryForm from '@/components/admin/DonationCategoryForm'

export default async function EditDonationCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const category = await prisma.donationCategory.findUnique({
    where: { id },
  })

  if (!category) {
    notFound()
  }

  // Convert Prisma JSON to plain object for React Hook Form
  const initialData = {
    ...category,
    tiers: category.tiers as any[] || [],
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Edit Donation Category
        </h1>
        <p className="text-gray-600">Update category details, images, and donation tiers</p>
      </div>

      <DonationCategoryForm initialData={initialData} id={id} />
    </div>
  )
}
