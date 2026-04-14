import Image from 'next/image'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { deities } from '@/lib/content'

export const metadata = {
  title: 'Deities | Shree Durga Adishakti Temple',
  description: 'Learn about the deities worshipped at Shree Durga Adishakti Temple.',
}

export default function DeitiesPage() {
  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Our Deities</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Discover the divine forms worshipped at our temple and their spiritual significance
        </p>
      </Section>

      <Section background="white">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deities.map((deity) => (
            <Card key={deity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden bg-temple-off-white">
                  {deity.image ? (
                    <Image
                      src={deity.image}
                      alt={deity.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-temple-maroon text-4xl font-serif">
                        {deity.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <CardTitle>{deity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{deity.description}</CardDescription>
                <div className="space-y-2">
                  {deity.festivals.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-temple-maroon mb-1">Festivals:</h4>
                      <p className="text-sm text-gray-600">{deity.festivals.join(', ')}</p>
                    </div>
                  )}
                  {deity.specialDays.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-temple-maroon mb-1">Special Days:</h4>
                      <p className="text-sm text-gray-600">{deity.specialDays.join(', ')}</p>
                    </div>
                  )}
                  {deity.specialSevas && deity.specialSevas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-temple-maroon mb-1">Special Sevas:</h4>
                      <p className="text-sm text-gray-600">{deity.specialSevas.join(', ')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

