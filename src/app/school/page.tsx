import Link from 'next/link'
import { redirect } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Section from '@/components/ui/Section'

export const metadata = {
  title: 'Prajna International School',
  description:
    'Nurturing minds, bodies, and souls through holistic education. Learn about Prajna International School.',
}

export default function SchoolPage() {
  // Redirect to about page, or you can show an overview page
  redirect('/school/about')
}

