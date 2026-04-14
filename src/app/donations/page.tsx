import { prisma } from '@/lib/prisma'
import DonationsClient from './DonationsClient'

export const metadata = {
  title: 'Make a Donation | Shree Durga Adishakti Temple',
  description: 'Support the temple and school through your generous contributions. Choose from various causes including Annadan, Gau Seva, and Education.',
}

export default async function DonationsPage() {
  const categories = await prisma.donationCategory.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })

  // Ensure tiers are parsed as arrays
  const formattedCategories = categories.map(cat => ({
    ...cat,
    tiers: cat.tiers as any[] || []
  }))

  return <DonationsClient initialCategories={formattedCategories} />
}
