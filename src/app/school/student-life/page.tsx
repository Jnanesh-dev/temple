import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export const metadata = {
  title: 'Student Life | Prajna International School',
  description:
    'Discover the vibrant student life, activities, and programs at Prajna International School.',
}

const activities = [
  {
    category: 'Cultural Activities',
    items: [
      'Annual Day celebrations',
      'Festival celebrations',
      'Dance and drama performances',
      'Music concerts',
      'Art exhibitions',
    ],
  },
  {
    category: 'Competitions',
    items: [
      'Inter-school competitions',
      'Debate and elocution',
      'Science fairs',
      'Math olympiad',
      'Sports tournaments',
    ],
  },
  {
    category: 'Spiritual Programs',
    items: [
      'Daily yoga and meditation',
      'Value-based education sessions',
      'Spiritual discourses',
      'Community service projects',
      'Celebration of festivals',
    ],
  },
  {
    category: 'Clubs & Societies',
    items: [
      'Science Club',
      'Literary Club',
      'Art Club',
      'Music Club',
      'Sports Club',
      'Eco Club',
    ],
  },
]

export default function StudentLifePage() {
  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Student Life</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          A vibrant community where students learn, grow, and thrive together
        </p>
      </Section>

      {/* Overview */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6">Life at Prajna</h2>
          <p className="text-lg text-gray-700 mb-4">
            Student life at Prajna International School is vibrant and enriching, offering
            numerous opportunities for personal growth, skill development, and community
            engagement. We believe that education extends beyond the classroom, and our diverse
            programs reflect this philosophy.
          </p>
          <p className="text-lg text-gray-700">
            From cultural celebrations to academic competitions, from spiritual practices to
            community service, students at Prajna experience a well-rounded education that prepares
            them for life beyond school.
          </p>
        </div>
      </Section>

      {/* Activities */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-8 text-center">Activities & Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((activity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{activity.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                    {activity.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Daily Routine */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">A Day at Prajna</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-temple-maroon text-white flex items-center justify-center font-bold mr-4">
                    AM
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-temple-maroon mb-2">Morning</h3>
                    <p className="text-gray-700">
                      The day begins with assembly, prayers, and value-based education sessions.
                      Students then proceed to their academic classes, engaging in interactive
                      learning activities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-temple-gold text-temple-maroon flex items-center justify-center font-bold mr-4">
                    PM
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-temple-maroon mb-2">Afternoon</h3>
                    <p className="text-gray-700">
                      Afternoon sessions include co-curricular activities, sports, yoga, and
                      meditation. Students also participate in club activities and special programs
                      based on their interests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Values & Community */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">Community & Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Respect</h3>
                <p className="text-gray-700 text-sm">
                  We foster a culture of mutual respect among students, teachers, and staff.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Unity</h3>
                <p className="text-gray-700 text-sm">
                  Students from diverse backgrounds come together as one community.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold text-temple-maroon mb-2">Service</h3>
                <p className="text-gray-700 text-sm">
                  Community service projects teach students the value of giving back.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}

