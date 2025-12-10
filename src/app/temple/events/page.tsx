import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { events } from '@/lib/content'

export const metadata = {
  title: 'Events & Festivals | Shree Durga Adishakti Temple',
  description:
    'Stay updated with upcoming events, festivals, and celebrations at Shree Durga Adishakti Temple.',
}

export default function EventsPage() {
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  )
  const pastEvents = events.filter((event) => new Date(event.date) < new Date())

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Events & Festivals</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Join us in celebrating festivals and special events throughout the year
        </p>
      </Section>

      <Section background="white">
        <h2 className="heading-2 mb-8">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                {event.banner && (
                  <div className="relative w-full h-48 bg-temple-off-white rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400">Event Banner</span>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle>{event.title}</CardTitle>
                    <span className="px-2 py-1 text-xs font-medium bg-temple-gold-light text-temple-maroon rounded">
                      {event.type}
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}{' '}
                    • {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">No upcoming events scheduled. Please check back soon.</p>
            </CardContent>
          </Card>
        )}
      </Section>

      {pastEvents.length > 0 && (
        <Section background="off-white">
          <h2 className="heading-2 mb-8">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

