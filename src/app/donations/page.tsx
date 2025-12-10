'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { donationCategories } from '@/lib/content'

const donationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  amount: z.number().min(100, 'Minimum donation amount is ₹100'),
  purpose: z.string().min(1, 'Please select a donation purpose'),
  frequency: z.enum(['one-time', 'monthly']),
})

type DonationFormData = z.infer<typeof donationSchema>

const quickAmounts = [500, 1000, 2500, 5000, 10000]

export default function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      frequency: 'one-time',
      amount: 1000,
      purpose: '',
    },
  })

  const selectedPurpose = watch('purpose')
  const amount = watch('amount')

  const onSubmit = async (data: DonationFormData) => {
    // TODO: Integrate with payment gateway (Razorpay/PayU/Stripe)
    console.log('Donation data:', data)
    
    // Simulate payment processing
    alert(
      `Thank you for your donation! This would normally redirect to payment gateway.\n\nAmount: ₹${data.amount}\nPurpose: ${donationCategories.find((c) => c.id === data.purpose)?.name}\nFrequency: ${data.frequency}`
    )
  }

  const categoryOptions = donationCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Donations</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Your generous contributions help us serve the community and maintain the temple
        </p>
      </Section>

      <Section background="white">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Your donations support temple maintenance, annadanam (free food service), education
              programs, and various community welfare activities. We are grateful for your
              generosity and commitment to our mission.
            </p>
          </div>

          {/* Donation Categories */}
          <h2 className="heading-2 mb-6">Donation Categories</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {donationCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setValue('purpose', category.id)}
                    className={selectedPurpose === category.id ? 'bg-temple-maroon text-white border-temple-maroon' : ''}
                  >
                    Donate to this cause
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Donation Form */}
          <Card className="bg-temple-off-white">
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>Fill in your details to proceed with the donation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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

                  <div>
                    <label
                      htmlFor="purpose"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Donation Purpose *
                    </label>
                    <Select
                      id="purpose"
                      {...register('purpose')}
                      options={[
                        { value: '', label: 'Select a purpose' },
                        ...categoryOptions,
                      ]}
                    />
                    {errors.purpose && (
                      <p className="text-red-600 text-sm mt-1">{errors.purpose.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                  </label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Your address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt)
                          setValue('amount', amt)
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedAmount === amt || amount === amt
                            ? 'bg-temple-maroon text-white'
                            : 'bg-white border-2 border-temple-earth-tan text-gray-700 hover:bg-temple-off-white'
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="Enter custom amount"
                    min={100}
                  />
                  {errors.amount && (
                    <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="one-time"
                        {...register('frequency')}
                        className="mr-2"
                      />
                      One-time
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="monthly"
                        {...register('frequency')}
                        className="mr-2"
                      />
                      Monthly
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Compliance Note */}
          <Card className="mt-8 bg-temple-gold-light">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-temple-maroon mb-2">
                Tax Exemption & Bank Transfer
              </h3>
              <p className="text-gray-700 mb-4">
                Donations may be eligible for tax exemption under Section 80G of the Income Tax Act
                (subject to applicable regulations). Receipts will be provided for all donations.
              </p>
              <p className="text-gray-700">
                For offline donations via bank transfer, please contact us at [email/phone] for
                bank details.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}

