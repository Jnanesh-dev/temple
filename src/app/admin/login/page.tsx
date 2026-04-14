'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/website/home/hero.JPG" 
          alt="Temple Background" 
          fill 
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-temple-maroon/90 via-temple-maroon/70 to-black/80" />
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-temple-gold to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-temple-gold to-transparent opacity-50" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
          <div className="w-20 h-20 bg-temple-gold rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl ring-4 ring-white/10">
            <ShieldCheck className="w-10 h-10 text-temple-maroon" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wider uppercase">
            Administrative Portal
          </h1>
          <p className="text-temple-gold-light/80 text-sm mt-2">
            Shree Durga Adishakti Temple
          </p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/95 backdrop-blur-sm overflow-hidden">
          <div className="h-1.5 bg-temple-gold" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-temple-maroon text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center font-medium">
              Please enter your credentials to secure access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm animate-pulse">
                  <p className="font-bold">Access Denied</p>
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="email" className="text-xs uppercase font-black tracking-widest text-gray-400 mb-1.5 block ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@temple.com"
                      className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-temple-maroon/10 transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label htmlFor="password" className="text-xs uppercase font-black tracking-widest text-gray-400 block">
                      Security Key
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-temple-maroon/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold bg-temple-maroon hover:bg-red-900 shadow-lg hover:shadow-red-900/40 transition-all transform active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    'Enter Portal'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <div className="bg-gray-50/50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Authorized Personnel Only. System activity is logged.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

