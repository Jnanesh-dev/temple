# Prisma Setup Guide

This project now uses Prisma ORM for type-safe database access.

## Installation

```bash
npm install
```

This will install `@prisma/client` and `prisma` CLI.

## Setup

### 1. Configure Database URL

Update your `.env.local` file with the Prisma database URL:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/temple_db?schema=public
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

This creates the Prisma Client based on your schema.

### 3. Push Schema to Database

```bash
npm run db:push
```

This will create/update your database tables based on the Prisma schema.

### 4. (Optional) Create Migration

For production, use migrations:

```bash
npm run db:migrate:prisma
```

This creates a migration file and applies it to the database.

## Available Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:migrate:prisma` - Create and apply migration (production)
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Using Prisma in Your Code

```typescript
import { prisma } from '@/lib/prisma'

// Create
const donation = await prisma.donation.create({
  data: {
    donorName: 'John Doe',
    donorEmail: 'john@example.com',
    amount: 1000,
    purpose: 'Temple Maintenance',
  },
})

// Read
const donations = await prisma.donation.findMany({
  where: {
    paymentStatus: 'completed',
  },
  orderBy: {
    createdAt: 'desc',
  },
})

// Update
await prisma.donation.update({
  where: { id: donation.id },
  data: { paymentStatus: 'completed' },
})

// Delete
await prisma.donation.delete({
  where: { id: donation.id },
})
```

## Migration from Raw SQL

The existing API routes have been updated to use Prisma. You can find Prisma versions:
- `src/app/api/donations/route.prisma.ts`
- `src/app/api/contact/route.prisma.ts`
- `src/app/api/admissions/route.prisma.ts`

To switch to Prisma, rename these files to replace the existing routes:
- `route.prisma.ts` → `route.ts`

## Benefits of Prisma

1. **Type Safety** - Full TypeScript support with autocomplete
2. **Migrations** - Version-controlled database changes
3. **Query Builder** - Intuitive API for database operations
4. **Prisma Studio** - Visual database browser
5. **Better DX** - Less boilerplate, more productivity

## Schema Location

The Prisma schema is located at: `prisma/schema.prisma`

## Next Steps

1. Run `npm run db:generate` to generate the client
2. Run `npm run db:push` to sync your database
3. Update your API routes to use Prisma
4. Use `npm run db:studio` to explore your data

