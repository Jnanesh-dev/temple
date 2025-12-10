'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'

const enquirySchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  class: z.string().min(1, 'Please select a class'),
  message: z.string().optional(),
})

type EnquiryFormData = z.infer<typeof enquirySchema>

const classOptions = [
  { value: '', label: 'Select Class' },
  { value: 'pre-primary', label: 'Pre-Primary' },
  { value: 'primary', label: 'Primary' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' },
]

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  })

  const onSubmit = async (data: EnquiryFormData) => {
    // TODO: Integrate with backend/email service
    console.log('Admission enquiry:', data)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Admissions</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Join Prajna International School and embark on a journey of holistic education
        </p>
      </Section>

      {/* Admission Process */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-8 text-center">Admission Process</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-temple-maroon text-white flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-temple-maroon mb-2">
                      Enquiry & Application
                    </h3>
                    <p className="text-gray-700">
                      Submit an admission enquiry form or visit the school office to collect the
                      application form. Fill in all required details accurately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-temple-maroon text-white flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-temple-maroon mb-2">
                      Document Submission
                    </h3>
                    <p className="text-gray-700">
                      Submit all required documents including birth certificate, previous school
                      records (if applicable), and other necessary paperwork.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-temple-maroon text-white flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-temple-maroon mb-2">
                      Interaction & Assessment
                    </h3>
                    <p className="text-gray-700">
                      Students and parents will be invited for an interaction session. For certain
                      classes, a basic assessment may be conducted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-temple-maroon text-white flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-temple-maroon mb-2">
                      Confirmation & Fee Payment
                    </h3>
                    <p className="text-gray-700">
                      Upon acceptance, complete the admission formalities and fee payment to secure
                      your child&apos;s place at Prajna International School.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Eligibility & Documents */}
      <Section background="off-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Age-appropriate for the class level</li>
                  <li>Completion of previous class (for higher grades)</li>
                  <li>Medical fitness certificate</li>
                  <li>Parent/guardian commitment to school values</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Birth certificate</li>
                  <li>Previous school records (if applicable)</li>
                  <li>Transfer certificate (for higher grades)</li>
                  <li>Passport-size photographs</li>
                  <li>Medical certificate</li>
                  <li>Parent/guardian ID proof</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Fee Structure */}
      <Section background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">Fee Structure</h2>
          <Card className="bg-temple-off-white">
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-4">
                For detailed fee structure and payment plans, please contact the school office. We
                offer flexible payment options and scholarships may be available for eligible
                students.
              </p>
              <Button href="/contact" variant="primary">
                Contact for Fee Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Enquiry Form */}
      <Section background="off-white">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admission Enquiry Form</CardTitle>
              <CardDescription>
                Fill in your details and we will get back to you with more information
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
                    We have received your enquiry and will contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="studentName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Student Name *
                    </label>
                    <Input
                      id="studentName"
                      {...register('studentName')}
                      placeholder="Enter student's full name"
                    />
                    {errors.studentName && (
                      <p className="text-red-600 text-sm mt-1">{errors.studentName.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="parentName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Parent/Guardian Name *
                    </label>
                    <Input
                      id="parentName"
                      {...register('parentName')}
                      placeholder="Enter parent/guardian name"
                    />
                    {errors.parentName && (
                      <p className="text-red-600 text-sm mt-1">{errors.parentName.message}</p>
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
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                      Class Interested In *
                    </label>
                    <Select id="class" {...register('class')} options={classOptions} />
                    {errors.class && (
                      <p className="text-red-600 text-sm mt-1">{errors.class.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message (Optional)
                    </label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Any additional information or questions..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}

