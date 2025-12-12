# Creating All Database Tables

This guide will help you create all the database tables defined in the Prisma schema.

## All Tables to be Created

1. **users** - Admin users
2. **events** - Temple events and festivals
3. **gallery_images** - Gallery images
4. **donations** - Donation records
5. **contact_enquiries** - Contact form submissions
6. **admission_enquiries** - School admission requests
7. **ritual_bookings** - Ritual booking requests
8. **deities** - Deity information
9. **rituals** - Rituals and services
10. **leadership** - Leadership profiles
11. **donation_categories** - Donation categories
12. **page_content** - Page content management

## Method 1: Using Prisma Migrate (Recommended for Production)

This creates migration files and tracks changes:

```bash
cd /var/www/temple/temple

# 1. Generate Prisma client first
npm run db:generate

# 2. Create and apply migration
npx prisma migrate dev --name init

# OR for production (doesn't prompt):
npx prisma migrate deploy
```

## Method 2: Using Prisma DB Push (Quick, No Migration Files)

This directly syncs the schema to the database without migration files:

```bash
cd /var/www/temple/temple

# 1. Generate Prisma client
npm run db:generate

# 2. Push schema to database
npm run db:push
```

## Method 3: Manual SQL Migration (If Prisma fails)

If you need to create tables manually, use the SQL script:

```bash
cd /var/www/temple/temple

# Run the SQL migration script
npm run db:migrate
```

## Step-by-Step Instructions for VPS

### Option A: Production Migration (Recommended)

```bash
cd /var/www/temple/temple

# 1. Make sure .env.local has correct DATABASE_URL
cat .env.local | grep DATABASE_URL

# 2. Generate Prisma client
npm run db:generate

# 3. Create initial migration
npx prisma migrate dev --name init_all_tables

# This will:
# - Create migration files in prisma/migrations/
# - Apply the migration to your database
# - Generate Prisma client

# 4. Verify tables were created
npx prisma studio
# Or check directly:
psql $DATABASE_URL -c "\dt"
```

### Option B: Quick Push (Faster, No Migration History)

```bash
cd /var/www/temple/temple

# 1. Generate Prisma client
npm run db:generate

# 2. Push schema directly to database
npm run db:push

# 3. Verify
npx prisma studio
```

## Verify Tables Were Created

### Using Prisma Studio (Visual)
```bash
npm run db:studio
```
Then open http://localhost:5555 in your browser

### Using PostgreSQL CLI
```bash
psql $DATABASE_URL -c "\dt"
```

### Using Node.js Script
```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$queryRaw\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`.then(console.log).finally(() => prisma.\$disconnect())"
```

## Troubleshooting

### Error: "Migration engine failed to connect"
- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Verify network connectivity

### Error: "Table already exists"
- Tables might already exist from previous migrations
- Use `prisma migrate reset` to drop all tables (WARNING: deletes all data)
- Or use `prisma db push --force-reset` to reset

### Error: "Prisma Client not generated"
- Run `npm run db:generate` first
- Check that `node_modules/.prisma/client` exists

## After Creating Tables

1. **Create first admin user:**
   ```bash
   npm run admin:create
   ```

2. **Seed initial data (optional):**
   - Add some sample events
   - Add leadership profiles
   - Add deities
   - Add rituals

3. **Restart application:**
   ```bash
   pm2 restart temple-website
   ```

## Migration Files Location

If using `prisma migrate dev`, migration files will be created in:
```
prisma/migrations/
  └── YYYYMMDDHHMMSS_init_all_tables/
      └── migration.sql
```

These files track your database schema changes and can be version controlled.

