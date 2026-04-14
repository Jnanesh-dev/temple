/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production'

const scriptSrc = ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com']
if (isDevelopment) {
  scriptSrc.push("'unsafe-eval'")
}

const imgSrc = ["'self'", 'data:', 'blob:', 'https:']
if (isDevelopment) {
  imgSrc.push('http:')
}

const connectSrc = ["'self'", 'https://checkout.razorpay.com', 'https://*.razorpay.com']
if (isDevelopment) {
  connectSrc.push('http:', 'ws:')
}

const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          ...(!isDevelopment
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc.join(' ')}`,
              "style-src 'self' 'unsafe-inline'",
              `img-src ${imgSrc.join(' ')}`,
              "font-src 'self' data:",
              `connect-src ${connectSrc.join(' ')}`,
              "frame-src 'self' https://www.google.com https://checkout.razorpay.com https://*.razorpay.com",
              "form-action 'self' https://*.razorpay.com",
              "manifest-src 'self'",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
              ...(!isDevelopment ? ['upgrade-insecure-requests'] : []),
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
