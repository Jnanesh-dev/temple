import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { rituals } from '@/lib/content'

export const metadata = {
  title: 'Rituals & Services | Shree Durga Adishakti Temple',
  description:
    'Explore the various rituals and services offered at Shree Durga Adishakti Temple.',
}

export default function ServicesPage() {
  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Rituals & Services</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Book special poojas, rituals, and services to seek divine blessings
        </p>
      </Section>

      <Section background="white">
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg text-gray-700 text-center">
            We offer various rituals and services to help devotees connect with the divine. Each
            service is performed with devotion and according to traditional practices. Suggested
            donations help support the temple&apos;s operations and community services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {rituals.map((ritual) => (
            <Card key={ritual.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{ritual.name}</CardTitle>
                <CardDescription>{ritual.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Suggested Donation:</span>
                    <span className="text-lg font-semibold text-temple-maroon">
                      ₹{ritual.suggestedDonation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Duration:</span>
                    <span className="text-gray-700">{ritual.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Timing:</span>
                    <span className="text-gray-700">{ritual.timing}</span>
                  </div>
                </div>
                <Button
                  href="/contact?type=ritual-booking"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Enquire / Request Booking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-temple-off-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-temple-maroon mb-2">
                Custom Rituals & Special Occasions
              </h3>
              <p className="text-gray-700 mb-4">
                We also offer customized rituals for special occasions, birthdays, anniversaries, or
                specific needs. Please contact us to discuss your requirements.
              </p>
              <Button href="/contact" variant="primary">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}

