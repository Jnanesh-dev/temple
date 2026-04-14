import DonationCategoryForm from '@/components/admin/DonationCategoryForm'

export default function NewDonationCategoryPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Add New Donation Category
        </h1>
        <p className="text-gray-600">Create a new type of donation with thumbnails and tiers</p>
      </div>

      <DonationCategoryForm />
    </div>
  )
}
