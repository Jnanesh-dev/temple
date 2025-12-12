#!/bin/bash

# Script to create all database tables using Prisma
# Run this on your VPS

set -e  # Exit on error

echo "🚀 Starting database table creation..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it in .env.local file"
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")/.."

echo "📦 Step 1: Generating Prisma client..."
npm run db:generate

echo "📊 Step 2: Creating database tables..."
echo "Choose method:"
echo "1) Prisma Migrate (creates migration files, recommended)"
echo "2) Prisma DB Push (quick, no migration files)"

read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "Creating migration..."
        npx prisma migrate dev --name init_all_tables
        ;;
    2)
        echo "Pushing schema to database..."
        npx prisma db push
        ;;
    *)
        echo "Invalid choice. Using DB Push..."
        npx prisma db push
        ;;
esac

echo "✅ Database tables created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create admin user: npm run admin:create"
echo "2. Verify tables: npm run db:studio"
echo "3. Restart application: pm2 restart temple-website"

