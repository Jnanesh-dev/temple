# Admin Dashboard - Complete Summary

## 🎯 Overview

The admin dashboard provides **complete control** over every aspect of the temple website. All content is editable through a user-friendly interface with full CRUD (Create, Read, Update, Delete) operations.

## 📋 What's Editable

### ✅ Fully Editable (Full CRUD)

1. **Events** (`/admin/events`)
   - Create, edit, delete events
   - Manage festivals, satsangs, special poojas
   - Upload banner images
   - Set dates, times, and descriptions

2. **Gallery** (`/admin/gallery`)
   - Upload images
   - Delete images
   - Organize by categories (Temple, Festivals, Devotees, School)
   - Add alt text for accessibility

3. **Deities** (`/admin/deities`)
   - Create, edit, delete deity entries
   - Add descriptions, festivals, special days
   - Upload deity images
   - Set display order

4. **Rituals & Services** (`/admin/rituals`)
   - Create, edit, delete rituals
   - Set suggested donations, duration, timing
   - Enable/disable rituals
   - Set display order

5. **Leadership** (`/admin/leadership`)
   - Create, edit, delete leadership profiles
   - Add bios, messages, images
   - Set display order

6. **Donation Categories** (`/admin/donation-categories`)
   - Create, edit, delete categories
   - Enable/disable categories
   - Set display order

### 📊 View & Update Only

7. **Donations** (`/admin/donations`)
   - View all donations
   - Update payment status
   - View statistics

8. **Contact Enquiries** (`/admin/enquiries`)
   - View all contact form submissions
   - Update status (new → read → replied → resolved)
   - Read full messages

9. **Admission Enquiries** (`/admin/admissions`)
   - View all school admission requests
   - Update status (new → contacted → admitted → rejected)
   - Track admission process

10. **Ritual Bookings** (`/admin/ritual-bookings`)
    - View all booking requests
    - Update booking status (pending → confirmed → completed → cancelled)
    - View booking details

11. **Users** (`/admin/users`)
    - View all admin users
    - Delete users (cannot delete yourself)
    - Create new users via script: `npm run admin:create`

## 🚀 How to Use

### Accessing the Dashboard

1. Navigate to: `https://your-domain.com/admin/login`
2. Login with admin credentials
3. You'll see the dashboard with all management sections

### Common Workflows

#### Adding a New Event
1. Go to `/admin/events`
2. Click "Add New Event"
3. Fill in the form (title, description, date, time, type)
4. Optionally add banner image URL
5. Click "Save"
6. Event appears on `/temple/events` page automatically

#### Uploading Gallery Images
1. Go to `/admin/gallery`
2. Click "Upload Image"
3. Select image file
4. Choose category
5. Add alt text
6. Click "Upload"
7. Image appears in gallery automatically

#### Managing Deities
1. Go to `/admin/deities`
2. Click "Add New Deity"
3. Fill in name, description
4. Add festivals (comma-separated)
5. Add special days (comma-separated)
6. Add image URL
7. Save

#### Managing Rituals
1. Go to `/admin/rituals`
2. Click "Add New Ritual"
3. Fill in name, description
4. Set suggested donation amount
5. Set duration and timing
6. Toggle active/inactive
7. Save

#### Processing Donations
1. Go to `/admin/donations`
2. Find the donation
3. Click "Mark Complete" when payment is received
4. Status updates automatically

## 🔐 Security

- All admin routes require authentication
- Only users with `role: 'admin'` can access
- Passwords are hashed with bcrypt
- Sessions expire after 30 days
- All API endpoints verify admin status

## 📝 Database Models

All content is stored in PostgreSQL using Prisma ORM:

- `User` - Admin users
- `Event` - Events and festivals
- `GalleryImage` - Gallery images
- `Deity` - Deity information
- `Ritual` - Rituals and services
- `Leadership` - Leadership profiles
- `DonationCategory` - Donation categories
- `Donation` - Donation records
- `ContactEnquiry` - Contact form submissions
- `AdmissionEnquiry` - School admission requests
- `RitualBooking` - Ritual booking requests

## 🔄 Data Flow

**Admin Dashboard** → **API Routes** → **PostgreSQL Database** → **Frontend Pages**

All changes made in admin dashboard:
1. Are saved to PostgreSQL database
2. Are immediately available on frontend
3. Persist across server restarts

## 📚 Documentation

- **ADMIN_GUIDE.md** - Detailed guide for all admin features
- **ADMIN_SETUP.md** - Setup instructions for admin dashboard
- **PRISMA_SETUP.md** - Database setup instructions

## 🛠️ Next Steps

1. **Run migrations**: `npm run db:migrate:prisma` (after updating Prisma schema)
2. **Create admin user**: `npm run admin:create`
3. **Access dashboard**: Navigate to `/admin/login`
4. **Start managing**: Add content through the admin interface

## 💡 Tips

- Always add alt text to images for accessibility
- Use descriptive titles for events and content
- Keep content updated regularly
- Review enquiries daily and update statuses
- Test changes before publishing

## 🐛 Troubleshooting

- **Can't login?** Check admin user exists: `npm run admin:create`
- **Changes not showing?** Check database connection and Prisma client
- **Upload failing?** Check MinIO configuration in `.env.local`
- **Build errors?** Run `npm install` and `npm run db:generate`

