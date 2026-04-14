import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(req) {
    if (req.nextUrl.pathname === '/admin/login') {
      if (req.nextauth.token?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }

      return NextResponse.next()
    }

    const token = req.nextauth.token
    const isAdmin = token?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }

        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
