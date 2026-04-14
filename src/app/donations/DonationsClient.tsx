'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Script from 'next/script'
import Image from 'next/image'
import { createDonationOrder, verifyPayment, getPaymentPublicSettings } from '@/app/actions/paymentActions'
import { Heart, ChevronRight, Check, ArrowLeft, Info } from 'lucide-react'

const donationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  amount: z.number().min(10, 'Minimum donation amount is ₹10'),
  purpose: z.string().min(1, 'Please select a donation purpose'),
  frequency: z.enum(['one-time', 'monthly']),
})

type DonationFormData = z.infer<typeof donationSchema>

interface Category {
  id: string
  name: string
  description: string
  imageUrl?: string | null
  tiers: { label: string; amount: number }[]
}

export default function DonationsClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      frequency: 'one-time',
      amount: 1000,
      purpose: '',
    },
  })

  const amount = useWatch({ control, name: 'amount' })

  const onSubmit = async (data: DonationFormData) => {
    try {
      const orderResult = await createDonationOrder({
        ...data,
        categoryName: selectedCategory?.name
      })
      if (!orderResult.success) {
        alert('Failed to initiate payment: ' + orderResult.error)
        return
      }

      const settings = await getPaymentPublicSettings()
      if (!settings.keyId) {
        alert('Payment system is not properly configured. Please contact the administrator.')
        return
      }

      const options = {
        key: settings.keyId,
        amount: orderResult.amount,
        currency: 'INR',
        name: 'Shree Durga Adishakti Temple',
        description: `Donation for ${data.purpose}`,
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          const verifyResult = await verifyPayment({
            ...response,
            donationId: orderResult.donationId!,
          })
          
          if (verifyResult.success) {
            router.push('/donations/success')
          } else {
            alert('Payment verification failed: ' + verifyResult.error)
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: '#8B0000',
        },
      }

      if (!(window as any).Razorpay) {
        alert('Razorpay SDK failed to load. Please refresh the page.')
        return
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error('Donation flow error:', error)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat)
    setValue('purpose', cat.name)
    // Scroll to tiers section
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleSelectTier = (tierAmount: number) => {
    setValue('amount', tierAmount)
    setShowForm(true)
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Hero Banner */}
      <Section background="maroon" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/website/home/hero.JPG" alt="Background" fill className="object-cover" />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Heart className="w-12 h-12 mx-auto mb-6 text-temple-gold" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Sacred Offerings</h1>
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
            Your generous contributions sustain our spiritual traditions, community kitchens, and educational initiatives.
          </p>
        </div>
      </Section>

      <Section background="white">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* 1. Category Selection Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-temple-maroon mb-8 text-center flex items-center justify-center gap-3">
              Choose a Cause to Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialCategories.map((cat) => (
                <Card 
                  key={cat.id} 
                  className={`group cursor-pointer border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedCategory?.id === cat.id ? 'border-temple-maroon ring-2 ring-temple-maroon/10 shadow-xl' : 'border-transparent shadow-md'
                  }`}
                  onClick={() => handleSelectCategory(cat)}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {cat.imageUrl ? (
                      <Image 
                        src={cat.imageUrl} 
                        alt={cat.name} 
                        fill 
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-temple-off-white flex items-center justify-center text-temple-maroon/30">
                        <Heart size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">{cat.name}</h3>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-4">
                      {cat.description}
                    </p>
                    <div className="flex items-center text-temple-maroon font-bold group-hover:gap-2 transition-all">
                      <span>View donation options</span>
                      <ChevronRight size={18} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 2. Tier Selection & Form */}
          {selectedCategory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12 bg-temple-off-white rounded-3xl p-8 md:p-12 shadow-inner border border-gray-100">
              
              {/* Left Column: Tiers Selection */}
              <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-temple-maroon flex items-center justify-center text-white font-serif text-xl shadow-lg">
                    1
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-temple-maroon">Select Donation Level</h3>
                </div>

                <div className="space-y-4">
                  {selectedCategory.tiers.length > 0 ? (
                    selectedCategory.tiers.map((tier, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectTier(tier.amount)}
                        className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                          amount === tier.amount && showForm
                            ? 'bg-temple-maroon text-white border-temple-maroon shadow-lg transform scale-[1.02]'
                            : 'bg-white border-white hover:border-temple-maroon/30 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                             amount === tier.amount && showForm ? 'border-white bg-white/20' : 'border-gray-200'
                          }`}>
                            {amount === tier.amount && showForm && <Check size={14} className="text-white" />}
                          </div>
                          <span className="text-lg font-bold">{tier.label}</span>
                        </div>
                        <span className="text-xl font-serif font-black underline decoration-temple-gold-light decoration-4 underline-offset-4">
                          ₹{tier.amount.toLocaleString()}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-500 italic">
                      No predefined tiers for this category. Please enter any amount.
                    </div>
                  )}

                  {/* Custom Amount Field */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                      <Info size={14} />
                      <span className="text-sm">Or enter a custom amount</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                      <input
                        type="number"
                        placeholder="Custom Amount"
                        className={`w-full bg-white rounded-2xl py-6 pl-12 pr-6 border-2 font-bold text-xl focus:outline-none transition-all ${
                          !selectedCategory.tiers.some(t => t.amount === amount) && showForm
                            ? 'border-temple-maroon ring-4 ring-temple-maroon/5'
                            : 'border-white '
                        }`}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setValue('amount', val)
                          if (val > 0) setShowForm(true)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donor Form */}
              <div className="lg:col-span-5">
                <div className={`transition-all duration-500 transform ${
                  showForm ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-4 filter blur-[2px]'
                }`}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-temple-maroon flex items-center justify-center text-white font-serif text-xl shadow-lg">
                      2
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-temple-maroon">Donor Details</h3>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 shadow-xl border border-white space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs uppercase font-black tracking-widest text-gray-400 mb-2 block">Full Name</label>
                        <Input 
                           {...register('name')} 
                           className="bg-gray-50 border-none h-14 placeholder:text-gray-300"
                           placeholder="Enter your name" 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs uppercase font-black tracking-widest text-gray-400 mb-2 block">Email Address</label>
                        <Input 
                           {...register('email')} 
                           className="bg-gray-50 border-none h-14 placeholder:text-gray-300"
                           placeholder="your.email@example.com" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs uppercase font-black tracking-widest text-gray-400 mb-2 block">Contact Number</label>
                        <Input 
                           {...register('phone')} 
                           className="bg-gray-50 border-none h-14 placeholder:text-gray-300"
                           placeholder="+91 00000 00000" 
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-temple-maroon text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-red-900 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                      >
                        {isSubmitting ? 'Securing Connection...' : `Contribute ₹${amount.toLocaleString()}`}
                        {!isSubmitting && <ChevronRight size={20} />}
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                      By proceeding, you agree to our Terms of Service. Your data is protected by bank-grade TLS encryption.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Simple CTA back to top if nothing selected */}
          {!selectedCategory && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-temple-maroon/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-temple-maroon animate-pulse" size={40} />
              </div>
              <p className="text-gray-400 italic">Please select a cause above to continue with your donation</p>
            </div>
          )}
        </div>
      </Section>

      {/* Compliance & Trust Section */}
      <Section background="off-white" className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
          <div>
            <h4 className="text-lg font-bold text-temple-maroon mb-2">Tax Exemption</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Donations are eligible for tax exemption under Section 80G of the Income Tax Act. A formal receipt will be sent to your email after successful verification.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-temple-maroon mb-2">Direct Bank Transfer</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              For large corporate donations or manual bank transfers, please reach out to us directly at <strong>shreedurgaadishakthi@gmail.com</strong> for NEFT/RTGS details.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
