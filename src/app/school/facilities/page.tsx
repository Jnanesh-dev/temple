import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export const metadata = {
  title: 'Facilities | Prajna International School',
  description:
    'Explore the modern facilities and infrastructure at Prajna International School.',
}

const facilities = [
  {
    name: 'Classrooms',
    description:
      'Spacious, well-ventilated classrooms equipped with modern teaching aids and comfortable seating arrangements.',
  },
  {
    name: 'Library',
    description:
      'A well-stocked library with a wide collection of books, reference materials, and digital resources for students and teachers.',
  },
  {
    name: 'Science Laboratories',
    description:
      'Fully equipped laboratories for Physics, Chemistry, and Biology to facilitate hands-on learning and experimentation.',
  },
  {
    name: 'Computer Lab',
    description:
      'Modern computer laboratory with updated software and internet connectivity for digital literacy and research.',
  },
  {
    name: 'Playground',
    description:
      'Large playground with facilities for various sports activities including cricket, football, basketball, and athletics.',
  },
  {
    name: 'Yoga & Meditation Hall',
    description:
      'Dedicated space for yoga, meditation, and spiritual practices, promoting physical and mental well-being.',
  },
  {
    name: 'Art & Craft Room',
    description:
      'Creative space for art and craft activities, encouraging artistic expression and creativity among students.',
  },
  {
    name: 'Music Room',
    description:
      'Well-equipped music room for vocal and instrumental training, fostering musical talents and appreciation.',
  },
  {
    name: 'Transport',
    description:
      'School bus service available for safe and convenient transportation of students to and from school.',
  },
  {
    name: 'Cafeteria',
    description:
      'Clean and hygienic cafeteria serving nutritious meals and snacks, promoting healthy eating habits.',
  },
  {
    name: 'Medical Room',
    description:
      'Medical facility with first-aid equipment and basic healthcare support for students during school hours.',
  },
  {
    name: 'Security',
    description:
      '24/7 security surveillance and trained security personnel ensuring a safe and secure learning environment.',
  },
]

export default function FacilitiesPage() {
  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Facilities</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Modern infrastructure designed to support holistic learning and development
        </p>
      </Section>

      <Section background="white">
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg text-gray-700 text-center">
            Prajna International School is equipped with modern facilities and infrastructure to
            provide students with the best possible learning environment. Our facilities are
            designed to support academic excellence, physical development, creative expression, and
            spiritual growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{facility.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">{facility.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Additional Info */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-temple-gold-light">
            <CardContent className="pt-6">
              <h2 className="heading-3 mb-4 text-center">Infrastructure Highlights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-temple-maroon mb-2">Safety & Security</h3>
                  <p className="text-gray-700 text-sm">
                    Our campus is equipped with comprehensive security measures including CCTV
                    surveillance, secure entry/exit points, and trained security personnel.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-temple-maroon mb-2">Maintenance</h3>
                  <p className="text-gray-700 text-sm">
                    All facilities are regularly maintained and upgraded to ensure optimal
                    functionality and safety standards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-temple-maroon mb-2">Accessibility</h3>
                  <p className="text-gray-700 text-sm">
                    Our facilities are designed to be accessible to all students, ensuring an
                    inclusive learning environment.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-temple-maroon mb-2">Technology</h3>
                  <p className="text-gray-700 text-sm">
                    Modern technology is integrated throughout our facilities to enhance learning
                    experiences and administrative efficiency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}

