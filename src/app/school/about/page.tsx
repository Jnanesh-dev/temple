import Image from 'next/image'
import Section from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { leadership } from '@/lib/content'

export const metadata = {
  title: 'About Prajna International School',
  description:
    'Learn about Prajna International School, its vision, mission, and commitment to holistic education.',
}

export default function SchoolAboutPage() {
  const principal = leadership.find((l) => l.id === '2')

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Prajna International School</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Nurturing minds, bodies, and souls through holistic education
        </p>
      </Section>

      {/* Vision & Mission */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="heading-3 mb-4">Our Vision</h2>
                <p className="text-gray-700">
                  To create a nurturing educational environment where students develop not only
                  academic excellence but also spiritual awareness, moral values, and social
                  responsibility. We envision our students as future leaders who contribute
                  positively to society.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h2 className="heading-3 mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  To provide holistic education that integrates spiritual values with modern
                  academic excellence, fostering the development of well-rounded individuals who are
                  academically proficient, spiritually aware, and socially responsible.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="heading-2 mb-6">About Prajna International School</h2>
            <p className="text-gray-700 mb-4">
              Prajna International School, attached to Shree Durga Adishakti Temple, represents a
              unique blend of traditional wisdom and modern education. The word &quot;Prajna&quot;
              means wisdom or consciousness, reflecting our commitment to nurturing not just
              intellectual growth but also spiritual awareness.
            </p>
            <p className="text-gray-700 mb-4">
              Our school is dedicated to providing quality education that goes beyond textbooks. We
              believe in educating the whole child—mind, body, and soul. Our curriculum is designed
              to develop critical thinking, creativity, and character, while also instilling values
              of compassion, respect, and service to others.
            </p>
            <p className="text-gray-700 mb-4">
              The integration of spirituality and education at Prajna International School creates
              a unique learning environment where students learn to balance material success with
              spiritual growth. We offer regular yoga and meditation sessions, value-based education
              programs, and opportunities for community service.
            </p>
            <p className="text-gray-700">
              Our dedicated faculty members are committed to providing personalized attention to
              each student, ensuring that every child reaches their full potential. We maintain small
              class sizes to facilitate better teacher-student interaction and create a supportive
              learning environment.
            </p>
          </div>
        </div>
      </Section>

      {/* Principal Section */}
      {principal && (
        <Section background="off-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 mb-8 text-center">Message from the Principal</h2>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-temple-off-white flex items-center justify-center overflow-hidden">
                    {principal.image ? (
                      <Image
                        src={principal.image}
                        alt={principal.name}
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-temple-maroon text-5xl font-serif">
                        {principal.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-temple-maroon mb-2">
                    {principal.name}
                  </h3>
                  <p className="text-lg text-temple-maroon font-medium mb-4">
                    {principal.designation}
                  </p>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{principal.bio}</p>
                  {principal.message && (
                    <blockquote className="border-l-4 border-temple-gold pl-4 italic text-gray-700">
                      &quot;{principal.message}&quot;
                    </blockquote>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      )}

      {/* Values */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Excellence</h3>
                <p className="text-gray-700">
                  Striving for academic excellence while maintaining high standards in all
                  endeavors.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Integrity</h3>
                <p className="text-gray-700">
                  Upholding honesty, ethics, and moral principles in all actions and decisions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Compassion</h3>
                <p className="text-gray-700">
                  Fostering empathy, kindness, and service to others in our community and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Campus Highlights */}
      <Section background="off-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-2 mb-8 text-center">Campus Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: '/images/website/about school/WhatsApp Image 2025-04-01 at 22.26.09_a22a0e26.jpg',
                alt: 'Holistic Learning Spaces',
              },
              {
                src: '/images/website/about school/WhatsApp Image 2025-04-01 at 22.26.20_8dde7817.jpg',
                alt: 'Modern School Campus',
              },
              {
                src: '/images/website/about school/WhatsApp Image 2025-04-01 at 22.26.50_b7575c90.jpg',
                alt: 'Student Growth & Activities',
              },
            ].map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white font-serif text-lg tracking-wide">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="maroon">
        <div className="text-center">
          <h2 className="heading-2 text-white mb-4">Interested in Joining Us?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Learn more about our admissions process and facilities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/school/admissions" size="lg" variant="secondary">
              Admissions Information
            </Button>
            <Button href="/school/facilities" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-temple-maroon">
              View Facilities
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}

