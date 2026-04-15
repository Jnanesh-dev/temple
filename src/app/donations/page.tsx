import { prisma } from '@/lib/prisma'
import DonationsClient from './DonationsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Make a Donation | Shree Durga Adishakti Temple',
  description: 'Support the temple and school through your generous contributions. Choose from various causes including Annadan, Gau Seva, and Education.',
}

type DonationTier = {
  label: string
  amount: number
}

function parseDonationTiers(tiers: unknown): DonationTier[] {
  if (!Array.isArray(tiers)) {
    return []
  }

  return tiers.flatMap((tier) => {
    if (!tier || typeof tier !== 'object' || Array.isArray(tier)) {
      return []
    }

    const label = 'label' in tier ? tier.label : undefined
    const amount = 'amount' in tier ? tier.amount : undefined

    if (typeof label !== 'string' || typeof amount !== 'number') {
      return []
    }

    return [{ label, amount }]
  })
}

export default async function DonationsPage() {
  const categories = await prisma.donationCategory.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })

  type DonationCategoryRecord = (typeof categories)[number]

  const formattedCategories = categories.map((cat: DonationCategoryRecord) => ({
    ...cat,
    tiers: parseDonationTiers(cat.tiers),
  }))

  return <DonationsClient initialCategories={formattedCategories} />
}
