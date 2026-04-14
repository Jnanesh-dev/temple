import Image from 'next/image'
import Section from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { leadership } from '@/lib/content'

export const metadata = {
  title: 'About the Temple | Shree Durga Adishakti Temple',
  description:
    'Learn about the history, spiritual significance, and daily rituals of Shree Durga Adishakti Temple.',
}

export default function TempleAboutPage() {
  const guruji = leadership.find((l) => l.id === '1')

  return (
    <>
      {/* Hero */}
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">About the Temple</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          A sacred space dedicated to Maa Durga, where devotion meets divine grace
        </p>
      </Section>

      {/* History */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6">The Divine Origin</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              Shree Durga Adishakti Temple stands as a beacon of spiritual devotion and divine
              grace, born from a remarkable vision and divine intervention. The temple&apos;s
              origin story is deeply rooted in the spiritual journey of Shri Ramananda Guruji and
              a divine command from the goddess Adi Shakti herself.
            </p>
            <p className="text-gray-700 mb-4">
              The land where the temple now stands in Doddangudde had once been home to an ancient
              temple that was destroyed by a water-related calamity centuries ago. During a
              profound meditation on a full moon night, Guruji entered a state of
              super-consciousness where he encountered the eight-limbed goddess Adi Shakti. In this
              divine vision, the goddess revealed the sacred history of the land and instructed
              Guruji to rebuild the temple to restore her presence.
            </p>
            <p className="text-gray-700 mb-4">
              The goddess made two sacred promises: first, that she would bless Guruji with divine
              gifts to serve humanity, and second, she commanded that no visitor to the temple
              should ever leave without being fed. Deeply moved by this divine encounter, Guruji
              marked the site with a red stone and flowers, symbolizing the beginning of his sacred
              mission.
            </p>
            <p className="text-gray-700 mb-4">
              In 2007, the temple was fully consecrated, marking the culmination of this divine
              mission. Since then, the temple has been a center of faith where daily meals
              (Annadanam) are offered to all devotees, fulfilling the goddess&apos;s sacred
              command. The temple is dedicated to Maa Durga, the divine mother who represents the
              power of the Supreme Being, worshipped as the destroyer of evil and the protector of
              devotees.
            </p>
            <p className="text-gray-700">
              Today, Shree Durga Adishakti Temple serves not only as a place of worship but also
              as a center for spiritual learning, community service, and cultural preservation. We
              conduct daily prayers, special rituals, and celebrate various festivals throughout
              the year, bringing together devotees in a spirit of unity and devotion, all while
              ensuring that every visitor receives both spiritual nourishment and physical food as
              promised to the goddess.
            </p>
          </div>
        </div>
      </Section>

      {/* Sacred Glimpses */}
      <Section background="white">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-2 mb-8 text-center">Sacred Glimpses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                src: '/images/website/about temple/Nidhi Kumbha gayathri.JPG',
                alt: 'Nidhi Kumbha',
              },
              {
                src: '/images/website/about temple/CSU_6225.JPG',
                alt: 'Sacred Rituals',
              },
              {
                src: '/images/website/about temple/CSU_5941.JPG',
                alt: 'Divine Presence',
              },
              {
                src: '/images/website/about temple/CSU_0808.JPG',
                alt: 'Temple Sanctum',
              },
            ].map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white font-serif text-lg tracking-wide">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Daily Rituals */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6">Daily Rituals & Timings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Morning Aarti</h3>
                <p className="text-gray-600 mb-2">Time: 7:00 AM</p>
                <p className="text-gray-700">
                  Start your day with divine blessings through our morning aarti, offering prayers
                  and gratitude to Maa Durga.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Evening Aarti</h3>
                <p className="text-gray-600 mb-2">Time: 7:00 PM</p>
                <p className="text-gray-700">
                  Conclude your day with evening aarti, seeking peace and protection from the divine
                  mother.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Special Poojas</h3>
                <p className="text-gray-600 mb-2">By Appointment</p>
                <p className="text-gray-700">
                  Book special poojas for personal occasions, festivals, or to seek specific
                  blessings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Temple Hours</h3>
                <p className="text-gray-600 mb-2">Daily: 6:00 AM - 9:00 PM</p>
                <p className="text-gray-700">
                  The temple remains open throughout the day for devotees to offer prayers and seek
                  blessings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Dharma Adhikari Section */}
      {guruji && (
        <Section background="off-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 mb-6 text-center">Our Spiritual Head</h2>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-temple-off-white flex items-center justify-center overflow-hidden">
                    {guruji.image ? (
                      <Image
                        src={guruji.image}
                        alt={guruji.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-temple-maroon text-5xl font-serif">
                        {guruji.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-temple-maroon mb-2">
                    {guruji.name}
                  </h3>
                  <p className="text-lg text-temple-maroon font-medium mb-4">
                    {guruji.designation}
                  </p>
                </div>
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 space-y-4">
                    <p>
                      Shri Ramananda Guruji&apos;s journey is a remarkable story of faith,
                      resilience, and divine intervention. Born into a family with strong
                      traditions, he stood out among his eight siblings as the one who upheld and
                      carried forward the customs of his household.
                    </p>
                    <p>
                      Over the years, he tried his hand at various professions, from being a
                      vegetable vendor to running a book publishing company, and even worked as an
                      investigator for four insurance companies. However, his life took a dramatic
                      turn when he decided to establish a school with international standards in
                      the area of Doddangudde. Despite his noble intentions, his path was filled
                      with challenges and obstacles, leaving him searching for solutions.
                    </p>
                    <p>
                      One night, during his regular meditation on a full moon, Guruji experienced
                      a divine vision. He entered a state of super-consciousness where he saw the
                      eight-limbed goddess Adi Shakti. In an intense and mystical conversation, the
                      goddess revealed that the land chosen for the school had once been home to a
                      temple that was destroyed by a water-related calamity centuries ago. She
                      instructed Guruji to rebuild the temple to restore her presence and promised
                      him divine blessings. She also commanded that no visitor to the temple should
                      ever leave without being fed. Deeply moved, Guruji promised to fulfill her
                      wishes and marked the site with a red stone and flowers the next morning,
                      symbolizing the beginning of his mission.
                    </p>
                    <p>
                      After this encounter, Guruji experienced a profound transformation. He
                      developed an extraordinary ability to foresee events, read horoscopes with
                      precision, and offer solutions to almost any problem. Despite having no prior
                      knowledge of astrology, these divine gifts allowed him to guide countless
                      people. The goddess herself appointed him as a guru, entrusting him with the
                      responsibility to serve humanity, particularly those in need.
                    </p>
                    <p>
                      In 2007, the temple was fully consecrated, marking the culmination of
                      Guruji&apos;s divine mission. Since then, the temple has been a center of
                      faith, where daily meals are offered to all devotees as promised to the
                      goddess. In parallel, Guruji established a school in a temporary building,
                      providing free English-medium education and meals to children, ensuring they
                      receive both knowledge and nourishment. Despite limited resources, his focus
                      remained on fulfilling the goddess&apos;s commands and serving the community.
                    </p>
                    <p className="font-semibold text-temple-maroon">
                      Today, the temple and school stand as a testament to Shri Ramananda
                      Guruji&apos;s faith, perseverance, and commitment to the divine.
                    </p>
                  </div>
                  {guruji.message && (
                    <blockquote className="border-l-4 border-temple-gold pl-4 italic text-gray-700 mt-6 text-lg">
                      &quot;{guruji.message}&quot;
                    </blockquote>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      )}

      {/* Festivals */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6">Festivals & Celebrations</h2>
          <p className="text-lg text-gray-700 mb-6">
            Throughout the year, we celebrate various festivals and special occasions with great
            devotion and enthusiasm. These celebrations bring together devotees from all walks of
            life, fostering a sense of community and spiritual unity.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Navratri</h3>
                <p className="text-gray-700">
                  Nine days of devotion dedicated to Maa Durga, celebrated with special poojas,
                  bhajans, and community gatherings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Durga Puja</h3>
                <p className="text-gray-700">
                  Grand celebration of Maa Durga&apos;s victory over evil, marked by elaborate
                  decorations and special rituals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Vijayadashami</h3>
                <p className="text-gray-700">
                  Celebration of victory of good over evil, with special prayers and community
                  feasts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Other Festivals</h3>
                <p className="text-gray-700">
                  We also celebrate Ganesh Chaturthi, Maha Shivaratri, and other important
                  festivals throughout the year.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}

