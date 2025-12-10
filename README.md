# Shree Durga Adishakti Temple & Prajna International School

A premium, modern Next.js website for Shree Durga Adishakti Temple and Prajna International School.

## Features

- **Temple Section**: About, Deities, Rituals & Services, Events & Festivals, Gallery
- **School Section**: About, Academics, Admissions, Facilities, Student Life
- **Donations**: Online donation system with multiple categories
- **Leadership**: Profiles of key personnel
- **Contact**: Contact forms and visit information

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/              # Utilities and helpers
└── types/            # TypeScript type definitions
```

## Payment Integration

The donation system is structured to integrate with payment gateways like Razorpay, PayU, or Stripe. Configure your payment gateway credentials in environment variables.

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Add payment gateway keys when integrating
```

