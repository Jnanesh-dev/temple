import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AuthorizationError } from './errors'
import { handleApiError } from './errors'

/**
 * Check if user is authenticated as admin
 * Returns the session if valid, throws AuthorizationError if not
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    throw new AuthorizationError('Admin access required')
  }

  return session
}

/**
 * Wrapper for admin API routes that require authentication
 */
export function withAdminAuth(
  handler: (request: NextRequest, session: Awaited<ReturnType<typeof requireAdmin>>) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const session = await requireAdmin()
      return await handler(request, session)
    } catch (error) {
      const { message, statusCode } = handleApiError(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
  }
}

