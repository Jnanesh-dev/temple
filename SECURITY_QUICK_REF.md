# Security Quick Reference

## ✅ Currently Implemented

1. **Authentication & Authorization**
   - ✅ NextAuth.js with JWT sessions
   - ✅ Bcrypt password hashing
   - ✅ Admin role-based access control
   - ✅ Middleware protection for admin routes
   - ✅ Server-side session validation

2. **SQL Injection Prevention**
   - ✅ Parameterized queries (PostgreSQL $1, $2...)
   - ✅ Prisma ORM usage

3. **Input Validation**
   - ✅ Zod schema validation (frontend forms)
   - ✅ Zod validation in API routes (contact, admin/events)
   - ✅ Input sanitization utilities created

4. **Security Headers**
   - ✅ Content Security Policy (CSP)
   - ✅ X-Frame-Options: DENY
   - ✅ X-Content-Type-Options: nosniff
   - ✅ X-XSS-Protection
   - ✅ Strict-Transport-Security
   - ✅ Referrer-Policy
   - ✅ Permissions-Policy

5. **Rate Limiting**
   - ✅ Rate limiting utility created
   - ✅ Implemented on contact API route (5 req/15min)
   - ⚠️ In-memory (use Redis for production)

6. **Error Handling**
   - ✅ Custom error classes
   - ✅ Error handling utilities
   - ✅ No internal error exposure in production

## ⚠️ Still Needs Implementation

### High Priority

1. **Rate Limiting**
   - [ ] Add to donations API route
   - [ ] Add to admissions API route
   - [ ] Add to login endpoint (brute force protection)
   - [ ] Use Redis-based rate limiting for production

2. **Input Validation & Sanitization**
   - [ ] Add Zod validation to all remaining API routes
   - [ ] Add sanitization to donations API
   - [ ] Add sanitization to admissions API
   - [ ] Add sanitization to ritual bookings API
   - [ ] Install DOMPurify for HTML sanitization
   - [ ] Add sanitization to all admin API routes

3. **File Upload Security**
   - [ ] Add file size limits (max 10MB)
   - [ ] Add file type validation (whitelist)
   - [ ] Validate MIME types (not just extension)
   - [ ] Scan uploads for malware (optional)

4. **Environment Variables**
   - [ ] Generate strong NEXTAUTH_SECRET
   - [ ] Use strong passwords for all services
   - [ ] Document all required environment variables
   - [ ] Set up secret rotation schedule

### Medium Priority

5. **CSRF Protection**
   - [ ] Implement CSRF tokens on forms
   - [ ] Validate CSRF tokens in API routes

6. **Enhanced Session Security**
   - [ ] Reduce admin session timeout (2 hours)
   - [ ] Implement session rotation
   - [ ] Add "remember me" option with different timeout

7. **Monitoring & Logging**
   - [ ] Set up error tracking (Sentry)
   - [ ] Monitor failed login attempts
   - [ ] Set up security alerts
   - [ ] Audit log for admin actions

8. **Database Security**
   - [ ] Use read-only user for reporting queries
   - [ ] Enable PostgreSQL audit logging
   - [ ] Implement database backup encryption

### Low Priority (Future Enhancements)

9. **Advanced Security**
   - [ ] 2FA for admin accounts
   - [ ] IP whitelisting for admin (optional)
   - [ ] API key authentication for integrations
   - [ ] OAuth2 for third-party integrations

10. **Compliance**
    - [ ] GDPR compliance review
    - [ ] Privacy policy
    - [ ] Terms of service
    - [ ] Data retention policies

---

## 🔧 Quick Implementation Guide

### Add Rate Limiting to an API Route

```typescript
import { checkRateLimit, RateLimitError } from '@/lib/rateLimit'
import { handleApiError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  // Rate limit: 10 requests per minute
  const rateLimitResult = checkRateLimit(request, 10, 60000)
  
  if (!rateLimitResult.success) {
    const error = new RateLimitError('Too many requests')
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
  
  // ... rest of handler
}
```

### Add Validation to an API Route

```typescript
import { z } from 'zod'
import { ValidationError } from '@/lib/errors'
import { handleApiError } from '@/lib/errors'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const result = schema.safeParse(body)
  if (!result.success) {
    const error = new ValidationError('Validation failed', {
      fields: result.error.flatten().fieldErrors,
    })
    const { message, statusCode, details } = handleApiError(error)
    return NextResponse.json({ error: message, details }, { status: statusCode })
  }
  
  // Use result.data (validated and typed)
}
```

### Add Sanitization

```typescript
import { sanitizeString, sanitizeEmail } from '@/lib/sanitize'

const sanitized = {
  name: sanitizeString(data.name),
  email: sanitizeEmail(data.email),
}
```

---

## 📝 Checklist Before Production

- [ ] All API routes have rate limiting
- [ ] All API routes have input validation
- [ ] All inputs are sanitized
- [ ] Strong NEXTAUTH_SECRET set
- [ ] All passwords are strong and unique
- [ ] File upload limits enforced
- [ ] Error messages don't leak information
- [ ] Security headers are in place
- [ ] HTTPS/SSL enabled everywhere
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Environment variables documented
- [ ] Backups configured
- [ ] Monitoring and alerting set up
- [ ] Security incident response plan documented

---

**Last Updated:** 2024

