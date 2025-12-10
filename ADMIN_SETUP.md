# Admin Dashboard Setup Guide

## Overview

The admin dashboard provides complete management capabilities for the temple website. Only authenticated admin users can access it.

## Features

- **Dashboard**: Overview with statistics and recent activity
- **Events Management**: Create, edit, and delete temple events
- **Gallery Management**: Upload and manage gallery images
- **Donations Management**: View and manage all donations
- **Contact Enquiries**: Manage contact form submissions
- **Admission Enquiries**: Manage school admission requests
- **User Management**: Manage admin users
- **Settings**: Website configuration (coming soon)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install NextAuth.js and bcryptjs for authentication.

### 2. Set Up Environment Variables

Add to your `.env.local`:

```env
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Create Database Tables

```bash
# Using Prisma (recommended)
npm run db:generate
npm run db:push

# Or using SQL migration
npm run db:migrate
```

### 4. Create First Admin User

```bash
npm run admin:create
```

Follow the prompts to create your first admin user.

### 5. Access Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. You'll be redirected to the dashboard

## Admin Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Main dashboard
- `/admin/events` - Events management
- `/admin/gallery` - Gallery management
- `/admin/donations` - Donations management
- `/admin/enquiries` - Contact enquiries
- `/admin/admissions` - Admission enquiries
- `/admin/users` - User management
- `/admin/settings` - Settings

## Security

- All admin routes are protected by authentication middleware
- Only users with `role: 'admin'` can access admin pages
- Passwords are hashed using bcryptjs
- Sessions are managed by NextAuth.js with JWT strategy
- 30-day session expiration

## API Endpoints

All admin API endpoints require authentication:

- `GET/POST /api/admin/events` - Events CRUD
- `GET/PUT/DELETE /api/admin/events/[id]` - Event operations
- `GET/DELETE /api/admin/gallery/[id]` - Gallery operations
- `PATCH /api/admin/donations/[id]` - Update donation status
- `PATCH /api/admin/enquiries/[id]` - Update enquiry status
- `PATCH /api/admin/admissions/[id]` - Update admission status
- `DELETE /api/admin/users/[id]` - Delete user

## Creating Additional Admin Users

Use the script:
```bash
npm run admin:create
```

Or create via Prisma Studio:
```bash
npm run db:studio
```

Then manually create a user with:
- `role: 'admin'`
- Password hashed with bcrypt (10 rounds)

## Troubleshooting

### Can't login
- Check that user exists in database
- Verify password is correct
- Check NEXTAUTH_SECRET is set
- Check user role is 'admin'

### Middleware blocking access
- Ensure you're logged in
- Check session is valid
- Verify user role in database

### Database errors
- Run migrations: `npm run db:push`
- Check DATABASE_URL in .env.local
- Verify PostgreSQL is running

