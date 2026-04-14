import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is required')
}

// Track failed login attempts per email (simple in-memory approach)
// For production, use Redis or database
const failedLoginAttempts = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of failedLoginAttempts.entries()) {
    if (now > record.resetTime) {
      failedLoginAttempts.delete(key)
    }
  }
}, 5 * 60 * 1000)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        // Rate limiting: 5 failed attempts per 15 minutes per email
        const emailKey = credentials.email.toLowerCase()
        const now = Date.now()
        const attemptRecord = failedLoginAttempts.get(emailKey)

        if (attemptRecord && now < attemptRecord.resetTime) {
          if (attemptRecord.count >= 5) {
            const waitTime = Math.ceil((attemptRecord.resetTime - now) / 1000 / 60)
            throw new Error(
              `Too many failed login attempts. Please try again in ${waitTime} minute(s).`
            )
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        const isPasswordValid = user
          ? await bcrypt.compare(credentials.password, user.passwordHash)
          : false

        // Record failed attempt
        if (!user || !isPasswordValid) {
          const record = failedLoginAttempts.get(emailKey)
          if (record && now < record.resetTime) {
            record.count++
          } else {
            failedLoginAttempts.set(emailKey, {
              count: 1,
              resetTime: now + 15 * 60 * 1000, // 15 minutes
            })
          }
          throw new Error('Invalid email or password')
        }

        // Clear failed attempts on successful login
        failedLoginAttempts.delete(emailKey)

        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin only.')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  secret: nextAuthSecret,
}
