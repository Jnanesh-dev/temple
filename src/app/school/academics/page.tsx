import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export const metadata = {
  title: 'Academics & Curriculum | Prajna International School',
  description:
    'Learn about the academic programs, curriculum, and co-curricular activities at Prajna International School.',
}

export default function AcademicsPage() {
  const classes = [
    {
      level: 'Pre-Primary',
      ages: '3-5 years',
      description: 'Foundation building with play-based learning and early literacy skills.',
    },
    {
      level: 'Primary',
      ages: '6-10 years',
      description: 'Core subjects with emphasis on reading, writing, mathematics, and values education.',
    },
    {
      level: 'Middle School',
      ages: '11-13 years',
      description: 'Expanded curriculum with science, social studies, and introduction to critical thinking.',
    },
    {
      level: 'High School',
      ages: '14-17 years',
      description: 'Preparatory programs for board examinations with specialized subject choices.',
    },
  ]

  const coCurricular = [
    'Yoga and Meditation',
    'Music and Dance',
    'Art and Craft',
    'Sports and Physical Education',
    'Debate and Public Speaking',
    'Science Club',
    'Literary Club',
    'Community Service',
  ]

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Academics & Curriculum</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Comprehensive education that balances academic excellence with holistic development
        </p>
      </Section>

      {/* Curriculum Overview */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6">Curriculum Overview</h2>
          <p className="text-lg text-gray-700 mb-6">
            Prajna International School follows a comprehensive curriculum that integrates academic
            excellence with value-based education. Our curriculum is designed to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8 ml-4">
            <li>Develop critical thinking and problem-solving skills</li>
            <li>Foster creativity and innovation</li>
            <li>Instill moral values and ethical principles</li>
            <li>Promote spiritual awareness and mindfulness</li>
            <li>Encourage community service and social responsibility</li>
          </ul>

          <div className="bg-temple-off-white p-6 rounded-lg mb-8">
            <p className="text-gray-700">
              <strong>Note:</strong> The school follows [CBSE/State Board - to be confirmed]
              curriculum. Detailed curriculum information is available upon request.
            </p>
          </div>
        </div>
      </Section>

      {/* Classes Offered */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-8 text-center">Classes Offered</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {classes.map((classInfo, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{classInfo.level}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Ages: {classInfo.ages}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{classInfo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Co-Curricular Activities */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">Co-Curricular Activities</h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            We believe in the holistic development of students. Our co-curricular program includes:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coCurricular.map((activity, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <p className="text-gray-700 font-medium">{activity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Teaching Methodology */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6">Teaching Methodology</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-3">
                  Student-Centered Learning
                </h3>
                <p className="text-gray-700">
                  Our teaching approach focuses on active student participation, encouraging
                  questions, exploration, and discovery.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-3">
                  Integrated Approach
                </h3>
                <p className="text-gray-700">
                  We integrate academic subjects with values education, ensuring students understand
                  the practical application of knowledge.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-3">
                  Technology Integration
                </h3>
                <p className="text-gray-700">
                  Modern technology is used to enhance learning experiences while maintaining
                  balance with traditional teaching methods.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-3">
                  Spiritual Integration
                </h3>
                <p className="text-gray-700">
                  Regular yoga, meditation, and value-based sessions help students develop inner
                  peace and spiritual awareness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="maroon">
        <div className="text-center">
          <h2 className="heading-2 text-white mb-4">Want to Learn More?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Contact us for detailed curriculum information and academic programs
          </p>
          <Button href="/contact" size="lg" variant="secondary">
            Contact Us
          </Button>
        </div>
      </Section>
    </>
  )
}

