import { Leadership, Deity, Ritual, Event, DonationCategory, GalleryImage } from '@/types'

// Leadership data
export const leadership: Leadership[] = [
  {
    id: '1',
    name: 'Shri Ramananda Guruji',
    designation: 'Dharma Adhikari',
    role: 'Spiritual Head',
    bio: `Shri Ramananda Guruji's journey is a remarkable story of faith, resilience, and divine intervention. Born into a family with strong traditions, he stood out among his eight siblings as the one who upheld and carried forward the customs of his household. Over the years, he tried his hand at various professions, from being a vegetable vendor to running a book publishing company, and even worked as an investigator for four insurance companies. However, his life took a dramatic turn when he decided to establish a school with international standards in the area of Doddangudde. Despite his noble intentions, his path was filled with challenges and obstacles, leaving him searching for solutions. He sought guidance from astrologers and deities, but none could provide clarity or help.

One night, during his regular meditation on a full moon, Guruji experienced a divine vision. He entered a state of super-consciousness where he saw the eight-limbed goddess Adi Shakti. In an intense and mystical conversation, the goddess revealed that the land chosen for the school had once been home to a temple that was destroyed by a water-related calamity centuries ago. She instructed Guruji to rebuild the temple to restore her presence and promised him divine blessings. She also commanded that no visitor to the temple should ever leave without being fed. Deeply moved, Guruji promised to fulfill her wishes and marked the site with a red stone and flowers the next morning, symbolizing the beginning of his mission.

After this encounter, Guruji experienced a profound transformation. He developed an extraordinary ability to foresee events, read horoscopes with precision, and offer solutions to almost any problem. Despite having no prior knowledge of astrology, these divine gifts allowed him to guide countless people. The goddess herself appointed him as a guru, entrusting him with the responsibility to serve humanity, particularly those in need.

In 2007, the temple was fully consecrated, marking the culmination of Guruji's divine mission. Since then, the temple has been a center of faith, where daily meals are offered to all devotees as promised to the goddess. In parallel, Guruji established a school in a temporary building, providing free English-medium education and meals to children, ensuring they receive both knowledge and nourishment. Despite limited resources, his focus remained on fulfilling the goddess's commands and serving the community. Today, the temple and school stand as a testament to Shri Ramananda Guruji's faith, perseverance, and commitment to the divine.`,
    message: 'Welcome to the divine abode of Maa Durga. May Her blessings guide you on your path of spiritual growth and enlightenment.',
    image: '/images/leadership/ramananda-guruji.jpg',
  },
  {
    id: '2',
    name: 'Usha Ramanand',
    designation: 'Principal',
    role: 'Principal, Prajna International School',
    bio: 'Usha Ramanand brings years of educational excellence and spiritual wisdom to Prajna International School, fostering holistic development of students.',
    message: 'Education is not just about academics; it is about nurturing the mind, body, and soul. At Prajna, we strive to create well-rounded individuals.',
    image: '/images/leadership/usha-ramanand.jpg',
  },
  {
    id: '3',
    name: 'Kusuma Nagara',
    designation: 'Temple Administrator',
    role: 'Administrator',
    bio: 'Kusuma Nagara manages the day-to-day operations of the temple, ensuring smooth functioning of all services and events.',
    image: '/images/leadership/kusuma-nagara.jpg',
  },
]

// Deities data
export const deities: Deity[] = [
  {
    id: '1',
    name: 'Maa Durga',
    description: 'The presiding deity of the temple, Maa Durga is the divine mother who represents the power of the Supreme Being. She is worshipped as the destroyer of evil and protector of devotees.',
    festivals: ['Navratri', 'Durga Puja', 'Vijayadashami'],
    specialDays: ['Every Tuesday', 'Every Friday'],
    image: '/images/deities/durga.jpg',
  },
  {
    id: '2',
    name: 'Lord Ganesha',
    description: 'The remover of obstacles and the god of wisdom, Lord Ganesha is worshipped before any auspicious work.',
    festivals: ['Ganesh Chaturthi'],
    specialDays: ['Every Wednesday'],
    image: '/images/deities/ganesha.jpg',
  },
  {
    id: '3',
    name: 'Lord Shiva',
    description: 'The destroyer and transformer, Lord Shiva represents the ultimate reality and consciousness.',
    festivals: ['Maha Shivaratri', 'Shravan'],
    specialDays: ['Every Monday'],
    image: '/images/deities/shiva.jpg',
  },
]

// Rituals and Services
export const rituals: Ritual[] = [
  {
    id: '1',
    name: 'Daily Aarti',
    description: 'Morning and evening aarti with prayers and offerings to the deities.',
    suggestedDonation: 500,
    duration: '30 minutes',
    timing: 'Morning: 7:00 AM, Evening: 7:00 PM',
  },
  {
    id: '2',
    name: 'Abhishekam',
    description: 'Sacred bathing ceremony of the deity with milk, honey, and other auspicious items.',
    suggestedDonation: 1000,
    duration: '45 minutes',
    timing: 'By appointment',
  },
  {
    id: '3',
    name: 'Special Pooja',
    description: 'Customized pooja for specific needs and occasions.',
    suggestedDonation: 2500,
    duration: '1 hour',
    timing: 'By appointment',
  },
  {
    id: '4',
    name: 'Havan',
    description: 'Sacred fire ceremony for purification and blessings.',
    suggestedDonation: 5000,
    duration: '2 hours',
    timing: 'By appointment',
  },
]

// Events (sample - would come from CMS in production)
export const events: Event[] = [
  {
    id: '1',
    title: 'Navratri Festival',
    description: 'Nine days of devotion and celebration dedicated to Maa Durga.',
    date: '2024-10-03',
    time: '6:00 AM - 9:00 PM',
    type: 'festival',
    banner: '/images/events/navratri.jpg',
  },
  {
    id: '2',
    title: 'Weekly Satsang',
    description: 'Spiritual discourse and bhajan session every Sunday.',
    date: '2024-03-10',
    time: '6:00 PM - 8:00 PM',
    type: 'satsang',
  },
]

// Donation Categories
export const donationCategories: DonationCategory[] = [
  {
    id: '1',
    name: 'Temple Maintenance',
    description: 'Support the upkeep and maintenance of the temple premises and facilities.',
  },
  {
    id: '2',
    name: 'Annadanam / Prasadam',
    description: 'Contribute to the free food service (Annadanam) and prasadam distribution.',
  },
  {
    id: '3',
    name: 'Education Support',
    description: 'Support scholarships and educational programs for students of Prajna International School.',
  },
  {
    id: '4',
    name: 'General Donation',
    description: 'General donation for temple activities and community welfare programs.',
  },
]

// Gallery images (sample - would come from CMS in production)
export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: '/images/gallery/temple-1.jpg',
    alt: 'Temple exterior at golden hour',
    category: 'temple',
  },
  {
    id: '2',
    src: '/images/gallery/temple-2.jpg',
    alt: 'Temple interior with oil lamps',
    category: 'temple',
  },
  {
    id: '3',
    src: '/images/deities/durga.jpg',
    alt: 'Maa Durga deity',
    category: 'temple',
  },
  {
    id: '4',
    src: '/images/deities/ganesha.jpg',
    alt: 'Lord Ganesha deity',
    category: 'temple',
  },
  {
    id: '5',
    src: '/images/deities/shiva.jpg',
    alt: 'Lord Shiva deity',
    category: 'temple',
  },
  {
    id: '6',
    src: '/images/gallery/school-1.jpg',
    alt: 'Prajna International School building',
    category: 'school',
  },
]

