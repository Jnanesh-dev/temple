import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Temple | Shree Durga Adishakti Temple',
  description: 'Explore the temple, deities, rituals, events, and gallery.',
}

export default function TemplePage() {
  // Redirect to about page
  redirect('/temple/about')
}

