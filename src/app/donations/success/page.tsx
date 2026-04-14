import Link from 'next/link'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CheckCircle2, Heart, Calendar, Phone, Mail } from 'lucide-react'

export const metadata = {
  title: 'Donation Successful | Shree Durga Adishakti Temple',
}

export default function DonationSuccessPage() {
  return (
    <Section background="off-white" className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-temple-maroon mb-4">
          Thank You for Your Generosity
        </h1>
        <p className="text-xl text-gray-700 mb-8 px-4">
          Your donation has been successfully received. Your support helps us maintain our sacred traditions and continue our community services.
        </p>

        <Card className="shadow-xl border-t-4 border-t-green-500 mb-8 overflow-hidden">
          <CardHeader className="bg-temple-off-white pb-6">
            <CardTitle className="text-2xl font-serif text-temple-maroon flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 fill-temple-maroon" />
              Donation Acknowledged
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-temple-maroon" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider">Date</p>
                    <p className="font-medium text-gray-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-temple-maroon" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider">Status</p>
                    <p className="font-medium text-green-600">Captured & Verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 italic">
                &ldquo;May the divine blessings of Shree Durga Adishakti be with you and your family.&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Button href="/" variant="primary" className="px-8 py-3">
            Return Home
          </Button>
          <Button href="/temple/gallery" variant="outline" className="px-8 py-3 font-medium">
            View Sacred Glimpses
          </Button>
        </div>

        <div className="mt-12 text-gray-500 text-sm flex flex-col items-center gap-2">
          <p>For any queries regarding your donation, please contact us:</p>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>+91 94481 21395</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>shreedurgaadishakthi@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
