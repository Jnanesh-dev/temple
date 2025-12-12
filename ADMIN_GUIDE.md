# Complete Admin Dashboard Guide

## Overview

The admin dashboard provides **complete control** over all aspects of the temple website. Everything is editable through the admin interface with full CRUD (Create, Read, Update, Delete) operations.

## Access

1. Navigate to: `https://your-domain.com/admin/login`
2. Login with admin credentials
3. You'll be redirected to the dashboard

## Available Management Sections

### 1. Dashboard (`/admin/dashboard`)
- **Overview statistics**: Total donations, enquiries, admissions, events
- **Recent activity**: Latest donations and enquiries
- **Quick access** to all management sections

### 2. Events Management (`/admin/events`)
**Full CRUD Operations:**
- ✅ **Create** new events (festivals, satsang, special poojas)
- ✅ **View** all events in a table
- ✅ **Edit** existing events
- ✅ **Delete** events
- **Fields**: Title, Description, Date, Time, Type, Banner Image

**How to use:**
1. Click "Add New Event" button
2. Fill in event details
3. Upload banner image (optional)
4. Save
5. Events appear on `/temple/events` page automatically

### 3. Gallery Management (`/admin/gallery`)
**Full CRUD Operations:**
- ✅ **Upload** new images
- ✅ **View** all images in grid layout
- ✅ **Delete** images
- **Categories**: Temple, Festivals, Devotees, School

**How to use:**
1. Click "Upload Image" button
2. Select image file
3. Choose category
4. Add alt text for accessibility
5. Upload
6. Images appear in gallery automatically

### 4. Donations Management (`/admin/donations`)
**View & Update Operations:**
- ✅ **View** all donations with details
- ✅ **Update** payment status (pending → completed)
- ✅ **View** statistics (total, completed, pending, total amount)
- **Fields**: Donor info, Amount, Purpose, Status, Transaction ID

**How to use:**
1. View all donations in table
2. Click "Mark Complete" for pending donations
3. Filter by status if needed

### 5. Contact Enquiries (`/admin/enquiries`)
**View & Update Operations:**
- ✅ **View** all contact form submissions
- ✅ **Update** status (new → read → replied → resolved)
- ✅ **Read** full messages
- **Fields**: Name, Email, Subject, Message, Type, Status

**How to use:**
1. View all enquiries
2. Click "Read More" to see full message
3. Click "Mark Replied" to update status
4. Track which enquiries need attention

### 6. Admission Enquiries (`/admin/admissions`)
**View & Update Operations:**
- ✅ **View** all school admission requests
- ✅ **Update** status (new → contacted → admitted → rejected)
- ✅ **View** student and parent details
- **Fields**: Student name, Parent name, Class interested, Contact info

**How to use:**
1. View all admission enquiries
2. Use dropdown to update status
3. Track admission process

### 7. Deities Management (`/admin/deities`)
**Full CRUD Operations:**
- ✅ **Create** new deity entries
- ✅ **View** all deities
- ✅ **Edit** deity information
- ✅ **Delete** deities
- **Fields**: Name, Description, Festivals, Special Days, Image

**How to use:**
1. Click "Add New Deity"
2. Fill in deity details
3. Add festivals and special days
4. Upload deity image
5. Save
6. Appears on `/temple/deities` page

### 8. Rituals & Services (`/admin/rituals`)
**Full CRUD Operations:**
- ✅ **Create** new rituals/services
- ✅ **View** all rituals
- ✅ **Edit** ritual details
- ✅ **Delete** rituals
- ✅ **Enable/Disable** rituals
- **Fields**: Name, Description, Suggested Donation, Duration, Timing

**How to use:**
1. Click "Add New Ritual"
2. Fill in ritual details
3. Set suggested donation amount
4. Save
5. Appears on `/temple/services` page

### 9. Leadership Management (`/admin/leadership`)
**Full CRUD Operations:**
- ✅ **Create** new leadership profiles
- ✅ **View** all leaders
- ✅ **Edit** leader information
- ✅ **Delete** leaders
- **Fields**: Name, Designation, Role, Bio, Message, Image

**How to use:**
1. Click "Add New Leader"
2. Fill in profile details
3. Upload profile image
4. Add bio and message
5. Save
6. Appears on `/leadership` and home page

### 10. Donation Categories (`/admin/donation-categories`)
**Full CRUD Operations:**
- ✅ **Create** new donation categories
- ✅ **View** all categories
- ✅ **Edit** category details
- ✅ **Delete** categories
- ✅ **Enable/Disable** categories
- **Fields**: Name, Description

**How to use:**
1. Click "Add New Category"
2. Fill in category name and description
3. Save
4. Appears in donation form dropdown

### 11. Ritual Bookings (`/admin/ritual-bookings`)
**View & Update Operations:**
- ✅ **View** all ritual booking requests
- ✅ **Update** booking status (pending → confirmed → completed → cancelled)
- ✅ **View** booking details
- **Fields**: Name, Contact, Ritual, Preferred Date/Time, Special Requests

**How to use:**
1. View all bookings
2. Update status as bookings are processed
3. Track booking schedule

### 12. Page Content Management (`/admin/pages`)
**Full CRUD Operations:**
- ✅ **Edit** static page content
- ✅ **Manage** home page sections
- ✅ **Update** temple about page
- ✅ **Update** school about page
- **Pages**: Home, Temple About, School About, Academics, Facilities, etc.

**How to use:**
1. Select page to edit
2. Update content (rich text editor)
3. Save
4. Changes reflect immediately on website

### 13. Users Management (`/admin/users`)
**View & Delete Operations:**
- ✅ **View** all admin users
- ✅ **Delete** users (cannot delete yourself)
- ✅ **Create** new admin users (via script)

**How to use:**
1. View all users
2. Delete users if needed
3. Create new users: `npm run admin:create`

### 14. Settings (`/admin/settings`)
**Configuration:**
- Website settings
- Email configuration
- Payment gateway settings
- General preferences

## Complete CRUD Matrix

| Feature | Create | Read | Update | Delete |
|---------|--------|------|--------|--------|
| Events | ✅ | ✅ | ✅ | ✅ |
| Gallery | ✅ | ✅ | ❌ | ✅ |
| Deities | ✅ | ✅ | ✅ | ✅ |
| Rituals | ✅ | ✅ | ✅ | ✅ |
| Leadership | ✅ | ✅ | ✅ | ✅ |
| Donation Categories | ✅ | ✅ | ✅ | ✅ |
| Page Content | ✅ | ✅ | ✅ | ✅ |
| Donations | ❌ | ✅ | ✅ | ❌ |
| Contact Enquiries | ❌ | ✅ | ✅ | ❌ |
| Admission Enquiries | ❌ | ✅ | ✅ | ❌ |
| Ritual Bookings | ❌ | ✅ | ✅ | ❌ |
| Users | ✅* | ✅ | ❌ | ✅ |

*Users created via script: `npm run admin:create`

## Workflow Examples

### Adding a New Festival Event
1. Go to `/admin/events`
2. Click "Add New Event"
3. Fill form:
   - Title: "Diwali Celebration"
   - Description: "Grand Diwali celebration with special pooja"
   - Date: Select date
   - Time: "6:00 PM - 9:00 PM"
   - Type: "festival"
   - Upload banner image
4. Click "Save"
5. Event appears on `/temple/events` page automatically

### Managing Gallery Images
1. Go to `/admin/gallery`
2. Click "Upload Image"
3. Select image file
4. Choose category (Temple/Festivals/Devotees/School)
5. Add descriptive alt text
6. Click "Upload"
7. Image appears in gallery on `/temple/gallery`

### Updating Leadership Profile
1. Go to `/admin/leadership`
2. Click "Edit" on a leader
3. Update bio, message, or image
4. Click "Save"
5. Changes reflect on `/leadership` and home page

### Processing a Donation
1. Go to `/admin/donations`
2. Find the donation
3. Click "Mark Complete" when payment is received
4. Status updates automatically

## Data Flow

**Admin Dashboard** → **Database (PostgreSQL)** → **Frontend Pages**

All changes made in admin dashboard are:
1. Saved to PostgreSQL database
2. Immediately available on frontend
3. Persistent across server restarts

## Best Practices

1. **Always add alt text** to images for accessibility
2. **Use descriptive titles** for events and content
3. **Keep content updated** regularly
4. **Review enquiries** daily and update statuses
5. **Backup database** regularly
6. **Test changes** on staging before production

## Security

- All admin routes require authentication
- Only users with `role: 'admin'` can access
- Passwords are hashed with bcrypt
- Sessions expire after 30 days
- All API endpoints verify admin status

## Support

For issues or questions:
- Check logs: `pm2 logs temple-website`
- Review database: `npm run db:studio`
- Check environment variables in `.env.local`

