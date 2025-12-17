# Security Documentation

## 🔒 Current Security Measures

### ✅ Authentication & Authorization

1. **NextAuth.js Implementation**
   - JWT-based session management
   - Admin-only authentication with role-based access control
   - Password hashing using bcryptjs
   - Session expiration: 30 days
   - Protected admin routes via middleware

2. **Route Protection**
   - Middleware protection for `/admin/*` routes
   - Server-side session validation in API routes
   - Layout-level authentication checks
   - Role-based access (admin-only)

3. **Password Security**
   - Passwords hashed with bcryptjs
   - Plain text passwords never stored in database

### ✅ Input Validation

1. **Frontend Validation**
   - Zod schema validation for all forms
   - React Hook Form integration
   - Type-safe form handling

2. **SQL Injection Prevention**
   - Parameterized queries using PostgreSQL's `$1, $2, ...` syntax
   - Prisma ORM for type-safe database queries
   - No raw SQL string concatenation

### ✅ Database Security

1. **Connection Pooling**
   - Limited connection pool (max 20 connections)
   - Connection timeout protection
   - SSL enabled in production

2. **Query Safety**
   - All queries use parameterized statements
   - Prisma ORM prevents SQL injection

### ✅ File Upload Security

1. **Authorization**
   - Upload endpoint requires admin authentication
   - Session validation before file processing

2. **File Handling**
   - Files stored in MinIO (separate from web server)
   - Unique file naming to prevent overwrites

---

## ⚠️ Security Gaps & Vulnerabilities

### 🔴 Critical Issues

1. **No Rate Limiting**
   - Public API endpoints (contact, donations, admissions) can be abused
   - No protection against brute force attacks on login
   - No protection against DDoS attacks

2. **No Input Sanitization**
   - User inputs accepted without sanitization (XSS risk)
   - HTML content stored directly in database
   - No content sanitization on display

3. **Weak NEXTAUTH_SECRET**
   - Default/weak secret in codebase
   - Should be strong random string in production

4. **Missing CORS Configuration**
   - No explicit CORS policy
   - Could allow unauthorized cross-origin requests

5. **No CSRF Protection**
   - No CSRF tokens on forms
   - API endpoints vulnerable to CSRF attacks

6. **Error Information Leakage**
   - Detailed error messages exposed to clients
   - Database errors potentially leak schema information

7. **No Request Size Limits**
   - File uploads have no size limit enforced
   - Could lead to DoS attacks

8. **Missing Security Headers**
   - No Content Security Policy (CSP)
   - No X-Frame-Options
   - No X-Content-Type-Options
   - No Referrer-Policy

9. **Admin API Routes - No Additional Validation**
   - Admin API routes accept any JSON without validation
   - Could lead to data corruption or injection

10. **Logging Security Issues**
    - Sensitive information might be logged
    - Query logging includes parameters (could leak sensitive data)

---

## 🛡️ Recommended Security Enhancements

### Priority 1: Critical (Implement Immediately)

#### 1. Rate Limiting
```bash
npm install express-rate-limit
# Or for Next.js
npm install @upstash/ratelimit @upstash/redis
```

**Implementation:**
- Add rate limiting to public API endpoints (contact, donations, admissions)
- Limit login attempts (5 attempts per 15 minutes)
- Limit file uploads per admin session
- Consider using Upstash Redis for distributed rate limiting

#### 2. Input Sanitization
```bash
npm install dompurify isomorphic-dompurify
npm install validator
```

**Implementation:**
- Sanitize all user inputs before storing in database
- Sanitize HTML content on display
- Validate file uploads (type, size, content)

#### 3. Strong NEXTAUTH_SECRET
```bash
# Generate secure secret
openssl rand -base64 32
```

**Action:**
- Generate strong random secret
- Store in environment variable
- Never commit to repository

#### 4. Security Headers
```bash
npm install next-security-headers
# Or use next.config.mjs
```

**Implementation:**
- Add Content Security Policy (CSP)
- Add X-Frame-Options: DENY
- Add X-Content-Type-Options: nosniff
- Add Referrer-Policy: strict-origin-when-cross-origin
- Add Permissions-Policy header

#### 5. CSRF Protection
```bash
npm install csrf
```

**Implementation:**
- Add CSRF tokens to all forms
- Validate CSRF tokens in API routes
- NextAuth provides some CSRF protection, but additional layer recommended

#### 6. Request Size Limits
- Configure Next.js body size limits
- Add file upload size limits (e.g., max 10MB for images)
- Validate file types (whitelist approach)

#### 7. Error Handling Improvement
- Create custom error handler
- Don't expose database errors to clients
- Log errors server-side only
- Return generic error messages to clients

### Priority 2: High (Implement Soon)

#### 8. API Input Validation
```bash
npm install zod
# Already installed, just need to use it in API routes
```

**Implementation:**
- Add Zod validation to all API routes
- Validate all admin API inputs
- Type-safe request/response handling

#### 9. File Upload Security Enhancement
- Validate file types by MIME type (not just extension)
- Scan uploaded files for malware (optional but recommended)
- Limit allowed file extensions
- Implement virus scanning (optional)

#### 10. Database Query Logging
- Remove or sanitize sensitive data from query logs
- Only log queries in development mode
- Implement structured logging

#### 11. Environment Variables Security
- Use strong, unique passwords for all services
- Rotate secrets regularly
- Use secret management service (Vault, AWS Secrets Manager, etc.)
- Never commit .env files

#### 12. Session Security
- Implement session rotation on privilege escalation
- Add IP address validation (optional, can cause issues with mobile networks)
- Reduce session timeout for admin accounts (e.g., 2 hours)

### Priority 3: Medium (Implement as Time Permits)

#### 13. Security Monitoring
```bash
npm install @sentry/nextjs
```

**Implementation:**
- Add error tracking (Sentry, LogRocket, etc.)
- Monitor failed login attempts
- Alert on suspicious activity
- Log security events

#### 14. Database Security
- Use read-only database user for reporting
- Implement database backup encryption
- Regular security audits
- Enable PostgreSQL audit logging

#### 15. MinIO Security
- Use SSL/TLS for MinIO connections
- Implement bucket policies
- Use presigned URLs with expiration
- Enable MinIO audit logging

#### 16. Content Security Policy (CSP)
- Implement strict CSP
- Use nonce or hash for inline scripts
- Restrict external resource loading
- Report CSP violations

#### 17. API Authentication Enhancement
- Add API key authentication for external integrations
- Implement OAuth2 for future third-party integrations
- Add request signing for critical operations

#### 18. Regular Security Audits
- Run dependency vulnerability scans: `npm audit`
- Use tools like Snyk or Dependabot
- Regular penetration testing
- Code review for security issues

---

## 🔧 Implementation Guide

### Step 1: Add Rate Limiting

Create `src/lib/rateLimit.ts`:
```typescript
import { NextRequest } from 'next/server'

// Simple in-memory rate limiter (use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || 'unknown'
}
```

### Step 2: Add Security Headers

Update `next.config.mjs`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  // ... rest of config
}
```

### Step 3: Add Input Sanitization

Create `src/lib/sanitize.ts`:
```typescript
import DOMPurify from 'isomorphic-dompurify'
import validator from 'validator'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  })
}

export function sanitizeString(input: string): string {
  return validator.escape(input.trim())
}

export function sanitizeEmail(email: string): string {
  return validator.normalizeEmail(email) || ''
}

export function sanitizeUrl(url: string): string {
  return validator.isURL(url) ? validator.escape(url) : ''
}
```

### Step 4: Add API Validation

Update API routes to use Zod:
```typescript
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  eventDate: z.string().datetime(),
  eventTime: z.string().optional(),
  eventType: z.enum(['festival', 'satsang', 'special-pooja', 'other']),
  bannerUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = eventSchema.parse(body) // Throws if invalid
    
    // Use validatedData instead of body
    const event = await prisma.event.create({
      data: validatedData
    })
    
    return NextResponse.json({ success: true, event })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Step 5: Add Error Handling

Create `src/lib/errors.ts`:
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function handleApiError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode }
  }
  
  // Don't expose internal errors
  console.error('Internal error:', error)
  return { message: 'An error occurred', statusCode: 500 }
}
```

---

## 📋 Security Checklist

### Before Production Deployment

- [ ] Generate strong `NEXTAUTH_SECRET` and store in environment
- [ ] Set strong passwords for database, MinIO, and all services
- [ ] Enable HTTPS/SSL for all connections
- [ ] Implement rate limiting on all public endpoints
- [ ] Add input sanitization to all user inputs
- [ ] Add security headers in `next.config.mjs`
- [ ] Validate all API inputs with Zod
- [ ] Add file upload size and type restrictions
- [ ] Implement error handling that doesn't leak information
- [ ] Enable CORS with specific allowed origins
- [ ] Set up security monitoring and alerting
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review and remove unused dependencies
- [ ] Set up automated backups
- [ ] Document all environment variables
- [ ] Review access logs regularly
- [ ] Set up fail2ban or similar for SSH protection
- [ ] Configure firewall rules (UFW)
- [ ] Enable PostgreSQL SSL connections
- [ ] Use read-only database user where possible
- [ ] Implement session timeout for admin accounts
- [ ] Add 2FA for admin accounts (future enhancement)

---

## 🔍 Regular Security Maintenance

### Weekly
- Review application logs for suspicious activity
- Check for failed login attempts
- Monitor error rates

### Monthly
- Run `npm audit` and update dependencies
- Review and rotate secrets (if needed)
- Review access logs
- Check for security updates to Node.js, PostgreSQL, etc.

### Quarterly
- Full security audit
- Penetration testing (if budget allows)
- Review and update security policies
- Backup restoration testing
- Update security documentation

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)

---

## 🆘 Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Contact the development team immediately
3. Document the vulnerability
4. Create a fix immediately
5. Deploy the fix to production
6. Review logs for any exploitation
7. If data was compromised, notify affected users per local regulations

---

**Last Updated:** 2024
**Next Review Date:** Quarterly

