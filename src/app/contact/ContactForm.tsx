'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { sendContactEmail } from '@/app/actions/emailActions'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.string().min(1, 'Please select an enquiry type'),
})

type ContactFormData = z.infer<typeof contactSchema>

const enquiryTypes = [
  { value: '', label: 'Select enquiry type' },
  { value: 'temple', label: 'Temple Enquiry' },
  { value: 'donation', label: 'Donation' },
  { value: 'school-admissions', label: 'School Admissions' },
  { value: 'ritual-booking', label: 'Ritual Booking' },
  { value: 'other', label: 'Other' },
]

export default function ContactForm() {
  const searchParams = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: '',
    },
  })

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) {
      setValue('type', type)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: ContactFormData) => {
    const result = await sendContactEmail(data)
    if (result.success) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      alert('Failed to send message. Please try again later.')
    }
  }

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Contact & Visit</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Get in touch with us or plan your visit to the temple and school
        </p>
      </Section>

      {/* Contact Information */}
      <Section background="white">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Temple Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Temple Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">
                      Shree Durga Adishakti Temple
                      <br />
                      9Q59+G82, Near Railway Bridge
                      <br />
                      Post Doddangudde, Doddanagudde
                      <br />
                      Kunjibettu, Udupi, Karnataka 576102
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">093427 49650</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">[Email to be updated]</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 mt-1 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Temple Hours</p>
                    <p className="text-gray-600">
                      Daily: 6:00 AM - 9:00 PM
                      <br />
                      Morning Aarti: 7:00 AM
                      <br />
                      Evening Aarti: 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Contact */}
          <Card>
            <CardHeader>
              <CardTitle>School Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">
                      Prajna International School
                      <br />
                      9Q59+G82, Near Railway Bridge
                      <br />
                      Post Doddangudde, Doddanagudde
                      <br />
                      Kunjibettu, Udupi, Karnataka 576102
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">093427 49650</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">[Email to be updated]</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 mt-1 text-temple-maroon flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Office Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Google Maps Placeholder */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="heading-3 mb-4">Location</h2>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.8633623417413!2d74.7682674!3d13.358771100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcbde14a783f15%3A0xb47a9dbac033e573!2sPrajna%20International%20School!5e0!3m2!1sen!2sin!4v1776165695792!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shree Durga Adishakti Temple Location"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                <a
                  href="https://maps.google.com/?q=9Q59+G82,+Near+Railway+Bridge,+Post+Doddangudde,+Doddanagudde,+Kunjibettu,+Udupi,+Karnataka+576102"
                  className="text-temple-maroon hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contact Form */}
      <Section background="white">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill in the form below and we will get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-green-600 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-maroon mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-700">
                    We have received your message and will contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Enquiry Type *
                    </label>
                    <Select id="type" {...register('type')} options={enquiryTypes} />
                    {errors.type && (
                      <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input id="name" {...register('name')} placeholder="Your full name" />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="+91 1234567890"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      {...register('subject')}
                      placeholder="Subject of your enquiry"
                    />
                    {errors.subject && (
                      <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Your message..."
                      rows={5}
                    />
                    {errors.message && (
                      <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Visit Information */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">Visit Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-3">
                  Temple Etiquette
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Please maintain silence and respect within the temple premises</li>
                  <li>Remove footwear before entering the main prayer hall</li>
                  <li>Dress modestly and appropriately</li>
                  <li>Follow the guidance of temple staff</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-temple-maroon mb-3">
                  Parking & Transport
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Parking facilities available on-site</li>
                  <li>Public transport accessible nearby</li>
                  <li>School bus service available for students</li>
                  <li>Wheelchair accessible entrance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}
