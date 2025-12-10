export interface Leadership {
  id: string
  name: string
  designation: string
  role: string
  bio: string
  message?: string
  image?: string
}

export interface Deity {
  id: string
  name: string
  description: string
  festivals: string[]
  specialDays: string[]
  image?: string
}

export interface Ritual {
  id: string
  name: string
  description: string
  suggestedDonation: number
  duration: string
  timing: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: 'festival' | 'satsang' | 'special-pooja' | 'other'
  banner?: string
}

export interface DonationCategory {
  id: string
  name: string
  description: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: 'temple' | 'festivals' | 'devotees' | 'school'
}

