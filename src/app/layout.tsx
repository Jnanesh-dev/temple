import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import MainLayout from '@/components/layout/MainLayout'
import StructuredData from '@/components/SEO/StructuredData'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: {
    default: 'Shree Durga Adishakti Temple & Prajna International School',
    template: '%s | Shree Durga Adishakti Temple',
  },
  description:
    'A divine abode of Maa Durga and a center for spiritual and educational upliftment. Explore our temple services, events, and learn about Prajna International School.',
  keywords: ['temple', 'Durga', 'spiritual', 'school', 'education', 'Prajna International School'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://shreedurgatemple.com',
    siteName: 'Shree Durga Adishakti Temple',
    title: 'Shree Durga Adishakti Temple & Prajna International School',
    description:
      'A divine abode of Maa Durga and a center for spiritual and educational upliftment.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shree Durga Adishakti Temple & Prajna International School',
    description:
      'A divine abode of Maa Durga and a center for spiritual and educational upliftment.',
  },
}

const templeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'PlaceOfWorship',
  name: 'Shree Durga Adishakti Temple',
  description:
    'A divine abode of Maa Durga and a center for spiritual and educational upliftment.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9Q59+G82, Near Railway Bridge, Post Doddangudde',
    addressLocality: 'Doddanagudde, Kunjibettu',
    addressRegion: 'Udupi',
    postalCode: '576102',
    addressCountry: 'IN',
  },
  telephone: '09342749650',
  openingHours: 'Mo-Su 06:00-21:00',
}

const schoolStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'School',
  name: 'Prajna International School',
  description:
    'A school providing holistic education that integrates spiritual values with modern academic excellence.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9Q59+G82, Near Railway Bridge, Post Doddangudde',
    addressLocality: 'Doddanagudde, Kunjibettu',
    addressRegion: 'Udupi',
    postalCode: '576102',
    addressCountry: 'IN',
  },
  telephone: '09342749650',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <StructuredData data={templeStructuredData} />
        <StructuredData data={schoolStructuredData} />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}

