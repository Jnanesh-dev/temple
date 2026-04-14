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
    image: '/images/website/managenment/CSU_1361.JPG',
  },
  {
    id: '2',
    name: 'Usha Ramanand',
    designation: 'Principal',
    role: 'Principal, Prajna International School',
    bio: 'Usha Ramanand brings years of educational excellence and spiritual wisdom to Prajna International School, fostering holistic development of students.',
    message: 'Education is not just about academics; it is about nurturing the mind, body, and soul. At Prajna, we strive to create well-rounded individuals.',
    image: '/images/website/managenment/WhatsApp Image 2025-04-01 at 22.31.45_4c9ac1cb.jpg',
  },
  {
    id: '3',
    name: 'Kusuma Nagara',
    designation: 'Temple Administrator',
    role: 'Administrator',
    bio: 'Kusuma Nagara manages the day-to-day operations of the temple, ensuring smooth functioning of all services and events.',
    image: '/images/website/managenment/WhatsApp Image 2025-04-01 at 22.33.02_469b1940.jpg',
  },
]

// Deities data
export const deities: Deity[] = [
  {
    id: '1',
    name: 'Maa Durga',
    description: 'The presiding deity of the temple, Maa Durga is the divine mother who represents the power of the Supreme Being. She is worshipped as the destroyer of evil and protector of devotees, sitting majestically on her lion with divine grace.',
    festivals: ['Navratri', 'Durga Puja', 'Vijayadashami'],
    specialDays: ['Every Tuesday', 'Every Friday'],
  },
  {
    id: '2',
    name: 'Shri Prasanna Ganapathi',
    description: 'Installed to the right of Devi Adisakthi is the Lord Prasanna Ganapathi who bestows clarity of mind, harmony, success without struggle, and emotional ease. He is worshipped to remove subtle inner blocks such as fear, doubt, and restlessness, and to invite smooth beginnings in spiritual and worldly pursuits. The special sevas offered to him includes Ranga Pooja, Mooduganapthi Seva and Sankasti Ganapathi Yaga.',
    festivals: ['Ganesh Chaturthi', 'Sankasti Ganapathi Yaga'],
    specialDays: ['Every Wednesday', 'Sankashti Chaturthi'],
    specialSevas: ['Ranga Pooja', 'Mooduganapthi Seva', 'Sankasti Ganapathi Yaga'],
    image: '/images/deities/IMG_3610.JPG',
  },
  {
    id: '3',
    name: 'Shri Balasubrahmanya',
    description: 'To the left of Adishakthi Amma, lies a dedicated sanctum for Lord Balasubrahmanya. Balasubrahmanya is worshipped to awaken inner bravery, clarity, learning, and moral strength, especially in children and students. His presence nurtures enthusiasm, sharp intellect, and a joyful sense of purpose, guiding devotees to face life\'s challenges with confidence and childlike sincerity.',
    festivals: ['Skanda Sashti'],
    specialDays: ['Shashti'],
    image: '/images/deities/IMG_3609.JPG',
  },
  {
    id: '4',
    name: 'Shri Mukhyaprana',
    description: 'Shri Mukhyaprāṇa is the supreme life-force (Prāṇa Tattva) and the divine manifestation of Vāyu Deva. Worship of Shri Mukhyaprāṇa bestows physical vitality, mental clarity, courage, and steadfast bhakti, while removing fear, weakness, and inertia. He inspires the seeker to live with selfless service, moral firmness, and surrender, making him the eternal guide for those walking the path of dharma and devotion.',
    festivals: ['Hanuman Jayanti'],
    specialDays: ['Every Saturday'],
    specialSevas: ['Ranga Pooja', 'Vayustuthi Homa', 'Madhu Abhishekam'],
  },
  {
    id: '11',
    name: 'Nathyaraani Gandharva Kanye',
    description: 'The most revered seva of the temple, Nrthya Seva is connected to this deity. The history of the temple says there existed a dancer who sought blessings of Adishakti by offering dance and arts of various forms. People who have had blockages and have seen no success in the field of art and dance have seen quick and great success in their respective field after worshipping Gandharva Kanye and Devi Adishakti.',
    festivals: [],
    specialDays: [],
    specialSevas: ['Nrthya Seva'],
  },
  {
    id: '6',
    name: 'Kubera Chitralekha Sahita Mahalaxmi',
    description: 'Kubera–Chitralekhā Sahita Mahālakṣmī Sannidhānam signifies the divine presence of Goddess Mahālakṣmī, seated with Kubera, the lord of wealth, and Chitralekhā, symbolizing disciplined accounting and righteous management of prosperity. This sacred combination represents abundance governed by dharma, where wealth flows with balance, responsibility, and purity. This sannidhānam is one of its kind in India, making the temple uniquely significant. A special Amāvasyā evening Prasanna Pūjā is offered here, invoking the compassionate and easily-pleased aspect of Mahālakṣmī to bless devotees with sustainable prosperity, financial clarity, protection of resources, and inner peace.',
    festivals: ['Varalakshmi Vratam', 'Deepavali'],
    specialDays: ['Every Friday', 'Amavasya'],
    specialSevas: ['Amavasya Evening Prasanna Puja'],
    image: '/images/deities/IMG_3232.JPG',
  },
  {
    id: '12',
    name: 'Yakshikannike Sahita Yaksheshwari',
    description: 'The sacred sannidhānam of Yakshikannike Sahita Yaksheshwari is an abode of divine feminine energy connected to nature, prosperity, and protection. Yaksheshwari is worshipped for abundance, well-being, and the removal of obstacles.',
    festivals: [],
    specialDays: [],
    image: '/images/deities/IMG_3604.JPG',
  },
  {
    id: '7',
    name: 'Shri Mahakali',
    description: 'Shri Mahākālī is the fierce protector and the transformative power of Time (Kāla). She is the destroyer of ego, ignorance, and dark forces. Her presence is a reminder that all that is temporary must pass, leaving behind only the eternal Truth. She is worshipped to gain protection from negativity.',
    festivals: ['Kali Puja'],
    specialDays: ['Amavasya'],
  },
  {
    id: '13',
    name: 'Sri Kalabhairava',
    description: 'Kālabhairava is the fierce yet compassionate form of Lord Śiva, the guardian of time (kāla) and cosmic order. He embodies discipline, fearlessness, and protection, destroying ignorance, ego, and negativity. Standing erect behind Adishakthi, as the kṣetrapāla (divine guardian), Kālabhairava safeguards the temple.',
    festivals: ['Kalashtami', 'Bhairava Ashtami'],
    specialDays: ['Every Sunday'],
    image: '/images/deities/4fcca3c4-76b9-49b1-8230-d16499d8869b.jpg',
  },
  {
    id: '9',
    name: 'Kapila Maharshi Sannidanam',
    description: 'Kapila Maharshi Sannidhānam marks the sacred presence of Sage Kapila, the mūla-guru of this holy place. It was through his intense tapas that Ādi Śakti was deeply pleased, and it was Kapila Maharshi who worshipped the Goddess at this very site centuries ago, establishing its powerful spiritual lineage. The temple was once a vibrant center of learning, where Vedic studies and various art schools flourished, offering shelter and guidance to countless students. Even today, devotees visit Kapila Maharshi Sannidhānam seeking relief from Guru Doṣa, Guru Śāpa, and to receive the grace of the Guru for clarity, learning, and right direction in life.',
    festivals: ['Guru Purnima'],
    specialDays: ['Daily'],
    image: '/images/website/events/guru  naman.JPG',
  },
  {
    id: '14',
    name: 'Shatshira Subrahmanya Swami',
    description: 'Valli–Devayāni Samhita Śat-Śirasa Subrahmaṇya Swāmi enshrined in this temple is a one-of-a-kind idol, signifying the rare and powerful grace of Lord Subrahmaṇya with both his divine consorts. This unique form symbolizes balance, righteous action, and the removal of deep-seated obstacles. Devotees visit this sannidhānam to light lamps—especially ghee lamps every Tuesday evening—to seek relief from Khuja Doṣa, which is believed to block important life aspects such as career progress and marriage. With sincere worship, Subrahmaṇya Swāmi\'s grace is said to restore clarity, confidence, and forward movement in life.',
    festivals: ['Skanda Sashti'],
    specialDays: ['Every Tuesday'],
    specialSevas: ['Ghee Lamp Offering (Tuesday Evenings)'],
  },
  {
    id: '5',
    name: 'Panchamukhi Gayathri Devi',
    description: 'Pañchamukhi Gāyatrī Devī, enshrined in this temple, is the powerful five-faced form of the Divine Mother, symbolizing the five prāṇas, five elements, and five aspects of supreme knowledge. Each face represents illumination of a different dimension of consciousness—wisdom, purity, strength, protection, and spiritual awakening. Worship of Pañchamukhi Gāyatrī Devī bestows clarity of intellect, removal of ignorance, inner discipline, and divine protection. Devotees seek her grace for success in education, spiritual progress, and balance in life, as her presence here radiates profound tejas (spiritual brilliance) and guidance on the path of dharma.',
    festivals: ['Gayathri Jayanti'],
    specialDays: ['Daily'],
  },
  {
    id: '8',
    name: 'Shri Maha Saraswathi',
    description: 'Shri Mahāsarasvatī is the goddess of wisdom, arts, music, and eloquence. She represents the flow of consciousness and the refined power of the intellect. Devotees, especially students and seekers of knowledge, pray to her to sharpen their minds, find creative inspiration, and articulate truth with clarity.',
    festivals: ['Saraswati Puja', 'Basant Panchami'],
    specialDays: ['Moola Nakshatra'],
  },
  {
    id: '10',
    name: 'Nagalaya',
    description: 'Nāgālaya, the sacred abode of Nāga Pañcha Brahma Sthāna along with Nāgarāja and Nāgarāṇi, represents the divine seat of serpent energy and the fivefold Brahma tattva. This powerful space symbolizes creation, protection, transformation, and earth-connected spiritual energy. Devotees worship at Nāgālaya to seek relief from Nāga Doṣa, ancestral imbalances, delays in marriage or progeny, and subtle disturbances in life. The presence of Nāgarāja and Nāgarāṇi bestows divine protection, lineage harmony, and overall well-being.',
    festivals: ['Naga Panchami', 'Subrahmanya Shashti'],
    specialDays: ['Ashlesha Nakshatra'],
    image: '/images/deities/IMG_6369.jpg',
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
  {
    id: '3',
    title: 'Annadanam Seva',
    description: 'Serving blessed food to devotees and the community.',
    date: '2025-04-18',
    time: '12:00 PM - 3:00 PM',
    type: 'special-pooja',
    banner: '/images/website/events/annadan.JPG',
  },
  {
    id: '4',
    title: 'Gayathri Consecration Anniversary',
    description: 'Commemorating the sacred installation of Goddess Gayathri.',
    date: '2025-05-12',
    time: '8:00 AM - 1:00 PM',
    type: 'festival',
    banner: '/images/website/events/gayathri concecration.JPG',
  },
  {
    id: '5',
    title: 'Annual Naga Temple Celebrations',
    description: 'Special rituals and processions at the Naga shrine.',
    date: '2025-06-05',
    time: '6:00 AM - 8:00 PM',
    type: 'festival',
    banner: '/images/website/events/annual celebrations of naga temple.JPG',
  },
  {
    id: '6',
    title: 'Friday Mahamangala Aarthi',
    description: 'Special auspicious aarthi performed every Friday evening.',
    date: '2025-04-25',
    time: '6:30 PM - 7:30 PM',
    type: 'special-pooja',
    banner: '/images/website/events/Friday aarthi.JPG',
  },
  {
    id: '7',
    title: 'Guru Naman',
    description: 'Honoring our spiritual guides and lineage.',
    date: '2025-07-20',
    time: '10:00 AM - 1:00 PM',
    type: 'satsang',
    banner: '/images/website/events/guru  naman.JPG',
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
    src: '/images/deities/IMG_6372.JPG',
    alt: 'Maa Durga deity',
    category: 'temple',
  },
  {
    id: '4',
    src: '/images/deities/IMG_6369.JPG',
    alt: 'Shri Prasanna Ganapathi deity',
    category: 'temple',
  },
  {
    id: '5',
    src: '/images/deities/IMG_6371.JPG',
    alt: 'Shri Mukhyaprana deity',
    category: 'temple',
  },
  {
    id: '6',
    src: '/images/gallery/school-1.jpg',
    alt: 'Prajna International School building',
    category: 'school',
  },
  {
    id: '7',
    src: '/images/website/home/hero.JPG',
    alt: 'Temple Hero View',
    category: 'temple',
  },
  {
    id: '8',
    src: '/images/website/home/gallery 5.JPG',
    alt: 'Temple Courtyard',
    category: 'temple',
  },
  {
    id: '9',
    src: '/images/website/about school/WhatsApp Image 2025-04-01 at 22.26.20_8dde7817.jpg',
    alt: 'Prajna International School Campus',
    category: 'school',
  },
  {
    id: '10',
    src: '/images/website/about temple/Nidhi Kumbha gayathri.JPG',
    alt: 'Nidhi Kumbha',
    category: 'temple',
  },
  {
    id: '11',
    src: '/images/website/about temple/CSU_6225.JPG',
    alt: 'Sacred Rituals',
    category: 'temple',
  },
  {
    id: '12',
    src: '/images/website/about temple/CSU_5941.JPG',
    alt: 'Divine Presence',
    category: 'temple',
  },
  {
    id: '13',
    src: '/images/website/about temple/CSU_0808.JPG',
    alt: 'Temple Sanctum',
    category: 'temple',
  },
  {
    id: '14',
    src: '/images/website/about school/WhatsApp Image 2025-04-01 at 22.26.50_b7575c90.jpg',
    alt: 'Student Growth & Activities',
    category: 'school',
  },
  {
    id: '15',
    src: '/images/website/about school/WhatsApp Image 2025-04-01 at 22.26.09_a22a0e26.jpg',
    alt: 'Holistic Learning Spaces',
    category: 'school',
  },
  {
    id: '16',
    src: '/images/website/events/annadan.JPG',
    alt: 'Annadanam Seva',
    category: 'festivals',
  },
  {
    id: '17',
    src: '/images/website/events/annual celebrations.JPG',
    alt: 'Annual Celebrations',
    category: 'festivals',
  },
  {
    id: '18',
    src: '/images/website/events/annual celebrations of naga temple.JPG',
    alt: 'Naga Temple Anniversary',
    category: 'festivals',
  },
  {
    id: '19',
    src: '/images/website/events/Friday aarthi.JPG',
    alt: 'Friday Mangala Aarthi',
    category: 'festivals',
  },
  {
    id: '20',
    src: '/images/website/events/gayathri concecration.JPG',
    alt: 'Gayathri Consecration',
    category: 'festivals',
  },
  {
    id: '21',
    src: '/images/website/events/guru  naman.JPG',
    alt: 'Guru Naman Celebration',
    category: 'festivals',
  },
  {
    id: '22',
    src: '/images/website/events/CSU_4244.JPG',
    alt: 'Temple Rituals',
    category: 'festivals',
  },
  {
    id: '23',
    src: '/images/website/events/CSU_4810.JPG',
    alt: 'Spiritual Gathering',
    category: 'festivals',
  },
  {
    id: '24',
    src: '/images/website/events/hero.JPG',
    alt: 'Grand Temple Event',
    category: 'festivals',
  },
]

