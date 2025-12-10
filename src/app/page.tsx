'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import { leadership, events } from '@/lib/content'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function HomePage() {
  const upcomingEvents = events.slice(0, 2)
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({})

  const toggleBio = (leaderId: string) => {
    setExpandedBios((prev) => ({
      ...prev,
      [leaderId]: !prev[leaderId],
    }))
  }

  const getBioPreview = (bio: string) => {
    return bio.split('\n')[0] + '...'
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon-dark/90 to-temple-maroon/80 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/images/temple-hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4">
            Shree Durga Adishakti Temple
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            A divine abode of Maa Durga and a center for spiritual and educational upliftment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/temple/about" size="lg" variant="secondary">
              Know the Temple
            </Button>
            <Button href="/school/about" size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-temple-maroon">
              Explore the School
            </Button>
            <Button href="/donations" size="lg" variant="secondary">
              Donate
            </Button>
          </div>
        </div>
      </section>

      {/* About Temple Preview */}
      <Section background="off-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="heading-2 mb-4">About the Temple</h2>
            <p className="text-lg text-gray-700 mb-4">
              Shree Durga Adishakti Temple stands as a beacon of spiritual devotion and divine
              grace. Our temple is dedicated to Maa Durga, the divine mother who represents the
              power of the Supreme Being.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We offer daily prayers, special rituals, and celebrate various festivals throughout the
              year, bringing together devotees in a spirit of unity and devotion.
            </p>
            <Button href="/temple/about">Learn More</Button>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/temple/temple-interior.jpg"
              alt="Temple interior with oil lamps and devotees"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      {/* About School Preview */}
      <Section background="white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
            <Image
              src="/images/school/school-building.jpg"
              alt="Prajna International School building"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="heading-2 mb-4">Prajna International School</h2>
            <p className="text-lg text-gray-700 mb-4">
              Prajna International School is committed to providing holistic education that nurtures
              the mind, body, and soul. We integrate spiritual values with modern academic
              excellence.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our curriculum is designed to develop well-rounded individuals who are not only
              academically proficient but also spiritually aware and socially responsible.
            </p>
            <Button href="/school/about">Know More</Button>
          </div>
        </div>
      </Section>

      {/* Highlights / What's New */}
      <Section background="off-white">
        <h2 className="heading-2 text-center mb-8">What&apos;s New</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  • {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <Button href="/temple/events" variant="outline" size="sm">
                  View All Events
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Leadership Strip */}
      <Section background="white">
        <h2 className="heading-2 text-center mb-8">Our Leadership</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {leadership.map((leader) => {
            const isExpanded = expandedBios[leader.id]
            const bioPreview = getBioPreview(leader.bio)
            const showFullBio = leader.id === '1' ? isExpanded : false

            return (
              <Card key={leader.id} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-temple-off-white flex items-center justify-center overflow-hidden">
                    {leader.image ? (
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-temple-maroon text-4xl font-serif">
                        {leader.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <CardDescription className="text-temple-maroon font-medium">
                    {leader.designation}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-left">
                    {leader.id === '1' ? (
                      <div>
                        <div
                          className={`text-sm text-gray-600 mb-4 transition-all duration-300 ${showFullBio ? '' : 'line-clamp-3'
                            }`}
                        >
                          {showFullBio ? (
                            <div className="space-y-3">
                              <p>
                                Shri Ramananda Guruji&apos;s journey is a remarkable story of faith,
                                resilience, and divine intervention. Born into a family with strong
                                traditions, he stood out among his eight siblings as the one who upheld
                                and carried forward the customs of his household.
                              </p>
                              <p>
                                Over the years, he tried his hand at various professions, from being a
                                vegetable vendor to running a book publishing company, and even worked
                                as an investigator for four insurance companies. However, his life took
                                a dramatic turn when he decided to establish a school with international
                                standards in the area of Doddangudde.
                              </p>
                              <p>
                                One night, during his regular meditation on a full moon, Guruji
                                experienced a divine vision. He entered a state of super-consciousness
                                where he saw the eight-limbed goddess Adi Shakti. The goddess revealed
                                that the land had once been home to a temple destroyed centuries ago and
                                instructed Guruji to rebuild it.
                              </p>
                              <p>
                                In 2007, the temple was fully consecrated, marking the culmination of
                                Guruji&apos;s divine mission. Today, the temple and school stand as a
                                testament to Shri Ramananda Guruji&apos;s faith, perseverance, and
                                commitment to the divine.
                              </p>
                            </div>
                          ) : (
                            <p>{bioPreview}</p>
                          )}
                        </div>
                        <button
                          onClick={() => toggleBio(leader.id)}
                          className="flex items-center gap-1 text-temple-maroon hover:text-temple-maroon-dark text-sm font-medium transition-colors mx-auto"
                        >
                          {isExpanded ? (
                            <>
                              <span>Show Less</span>
                              <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              <span>Read More</span>
                              <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{leader.bio}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button href="/leadership" variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <Button href="/leadership" variant="outline">
            View All Leadership
          </Button>
        </div>
      </Section>

      {/* Quick Links / CTAs */}
      <Section background="maroon">
        <div className="text-center">
          <h2 className="heading-2 text-white mb-8">Get Involved</h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Button href="/donations" size="lg" variant="secondary" className="w-full">
              Donate Now
            </Button>
            <Button href="/temple/services" size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-temple-maroon">
              Book a Ritual
            </Button>
            <Button href="/school/admissions" size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-temple-maroon">
              School Admissions
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}

