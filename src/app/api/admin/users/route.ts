import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, ValidationError } from '@/lib/errors'
import { sanitizeEmail, sanitizeString } from '@/lib/sanitize'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['admin']).default('admin'),
})

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const validationResult = userSchema.safeParse(body)
    if (!validationResult.success) {
      const error = new ValidationError('Validation failed', {
        fields: validationResult.error.flatten().fieldErrors,
      })
      const { message, statusCode, details } = handleApiError(error)
      return NextResponse.json({ error: message, details }, { status: statusCode })
    }

    const { name, email, password, role } = validationResult.data
    const sanitizedName = sanitizeString(name)
    const sanitizedEmail = sanitizeEmail(email)

    if (!sanitizedName || !sanitizedEmail) {
      return NextResponse.json({ error: 'Invalid user details' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash,
        role,
      },
    })

    // Don't return the password hash
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
