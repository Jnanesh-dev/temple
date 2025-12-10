'use client'

import { useState } from 'react'
import Image from 'next/image'
import Section from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { leadership } from '@/lib/content'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function LeadershipPage() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = (leaderId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [leaderId]: !prev[leaderId],
    }))
  }

  const getBioPreview = (bio: string, maxLength: number = 150) => {
    if (bio.length <= maxLength) return bio
    return bio.substring(0, maxLength).trim() + '...'
  }

  const getFullBio = (leader: typeof leadership[0]) => {
    if (leader.id === '1') {
      return (
        <div className="text-gray-700 space-y-4">
          <p>
            Shri Ramananda Guruji&apos;s journey is a remarkable story of faith, resilience, and
            divine intervention. Born into a family with strong traditions, he stood out among his
            eight siblings as the one who upheld and carried forward the customs of his household.
          </p>
          <p>
            Over the years, he tried his hand at various professions, from being a vegetable vendor
            to running a book publishing company, and even worked as an investigator for four
            insurance companies. However, his life took a dramatic turn when he decided to
            establish a school with international standards in the area of Doddangudde. Despite his
            noble intentions, his path was filled with challenges and obstacles, leaving him
            searching for solutions.
          </p>
          <p>
            One night, during his regular meditation on a full moon, Guruji experienced a divine
            vision. He entered a state of super-consciousness where he saw the eight-limbed goddess
            Adi Shakti. In an intense and mystical conversation, the goddess revealed that the land
            chosen for the school had once been home to a temple that was destroyed by a
            water-related calamity centuries ago. She instructed Guruji to rebuild the temple to
            restore her presence and promised him divine blessings. She also commanded that no
            visitor to the temple should ever leave without being fed. Deeply moved, Guruji promised
            to fulfill her wishes and marked the site with a red stone and flowers the next morning,
            symbolizing the beginning of his mission.
          </p>
          <p>
            After this encounter, Guruji experienced a profound transformation. He developed an
            extraordinary ability to foresee events, read horoscopes with precision, and offer
            solutions to almost any problem. Despite having no prior knowledge of astrology, these
            divine gifts allowed him to guide countless people. The goddess herself appointed him
            as a guru, entrusting him with the responsibility to serve humanity, particularly those
            in need.
          </p>
          <p>
            In 2007, the temple was fully consecrated, marking the culmination of Guruji&apos;s
            divine mission. Since then, the temple has been a center of faith, where daily meals
            are offered to all devotees as promised to the goddess. In parallel, Guruji established
            a school in a temporary building, providing free English-medium education and meals to
            children, ensuring they receive both knowledge and nourishment. Despite limited
            resources, his focus remained on fulfilling the goddess&apos;s commands and serving the
            community.
          </p>
          <p className="font-semibold text-temple-maroon">
            Today, the temple and school stand as a testament to Shri Ramananda Guruji&apos;s
            faith, perseverance, and commitment to the divine.
          </p>
        </div>
      )
    }
    return <p className="text-gray-700">{leader.bio}</p>
  }

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Leadership & Management</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Meet the dedicated individuals guiding our temple and school
        </p>
      </Section>

      <Section background="white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {leadership.map((leader) => {
              const isExpanded = expandedCards[leader.id]
              const bioPreview = getBioPreview(leader.bio)

              return (
                <Card
                  key={leader.id}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col ${
                    isExpanded ? 'md:col-span-3 md:row-span-2' : 'h-full'
                  }`}
                  onClick={() => toggleCard(leader.id)}
                >
                  <CardContent className={`pt-6 flex-1 flex flex-col ${isExpanded ? 'pb-6' : ''}`}>
                    {isExpanded ? (
                      // Expanded View
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Image Section */}
                        <div className="md:col-span-1 flex justify-center">
                          <div className="w-48 h-48 rounded-lg bg-temple-off-white flex items-center justify-center overflow-hidden">
                            {leader.image ? (
                              <Image
                                src={leader.image}
                                alt={leader.name}
                                width={192}
                                height={192}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-temple-maroon text-7xl font-serif">
                                {leader.name.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:col-span-2">
                          <h2 className="heading-3 mb-2">{leader.name}</h2>
                          <p className="text-lg text-temple-maroon font-medium mb-2">
                            {leader.designation}
                          </p>
                          <p className="text-sm text-gray-500 mb-6">{leader.role}</p>

                          {/* Full Bio */}
                          <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                            {getFullBio(leader)}
                          </div>

                          {/* Message Section */}
                          {leader.message && (
                            <blockquote className="border-l-4 border-temple-gold pl-4 italic text-gray-700 my-6 text-lg">
                              &quot;{leader.message}&quot;
                            </blockquote>
                          )}

                          {/* Collapse Button */}
                          <div className="flex items-center gap-1 text-temple-maroon hover:text-temple-maroon-dark font-medium mt-6 transition-colors">
                            <span>Show Less</span>
                            <ChevronUp size={18} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Collapsed View - Same size for all
                      <div className="flex flex-col h-full text-center">
                        {/* Image Section */}
                        <div className="flex justify-center mb-4">
                          <div className="w-32 h-32 rounded-lg bg-temple-off-white flex items-center justify-center overflow-hidden">
                            {leader.image ? (
                              <Image
                                src={leader.image}
                                alt={leader.name}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-temple-maroon text-5xl font-serif">
                                {leader.name.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col">
                          <h2 className="heading-3 mb-2">{leader.name}</h2>
                          <p className="text-lg text-temple-maroon font-medium mb-2">
                            {leader.designation}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">{leader.role}</p>

                          {/* Bio Preview */}
                          <div className="flex-1 mb-4">
                            <p className="text-gray-700 text-sm line-clamp-4">{bioPreview}</p>
                          </div>

                          {/* Expand Button */}
                          <div className="flex items-center justify-center gap-1 text-temple-maroon hover:text-temple-maroon-dark font-medium mt-auto transition-colors">
                            <span>Read More</span>
                            <ChevronDown size={18} />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Governing Body Note */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-temple-gold-light">
            <CardContent className="pt-6">
              <h2 className="heading-3 mb-4 text-center">Governing Body</h2>
              <p className="text-gray-700 text-center">
                The temple and school are managed by a dedicated governing body and trust members
                who work tirelessly to ensure the smooth functioning of all activities and the
                fulfillment of our mission. For more information about the governing body, please
                contact the temple office.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}
