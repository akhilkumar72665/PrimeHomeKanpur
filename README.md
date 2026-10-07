# PrimeHomeKanpur

PrimeHomeKanpur is a premium rental marketplace for Kanpur, built with Next.js, TypeScript, Tailwind CSS, and Supabase. The app is designed for property discovery, tenant/landlord workflows, bookings, and admin operations in a single full-stack product.

This repository contains the website, authentication flows, user dashboard, and admin portal used to manage listings, inquiries, reviews, and operations.

## Overview

- Verified rental listing platform for Kanpur neighborhoods
- Search and filter listings by location, rent, BHK, furnishing, and tenant type
- Property detail pages with visit scheduling and inquiry workflows
- User accounts with saved properties, dashboard views, and review support
- Admin tools for managing properties, users, reviews, team, locations, and transactions
- Contact, newsletter, and service-oriented pages for a complete lead-generation website

## Key features

- Home page with hero section, trust indicators, stats, popular locations, and service cards
- Rental listings page with live filtering and fallback mock data support
- Individual property detail experience with application/visit flows
- Agents page and neighborhood-focused area cards
- About, FAQ, services, disclaimer, privacy, refund, verification, and policy pages
- Dashboard for authenticated users:
  - wishlist
  - visits
  - reviews
  - profile
  - notifications
  - documents
  - security
- Admin portal with:
  - dashboard overview
  - property management
  - inquiries
  - reviews
  - locations
  - team members
  - users
  - verifications
  - reports
  - payment info
  - activity logs
  - newsletter management
- API routes for contact, property reporting, payment order creation/verification, and newsletter signup/unsubscribe
- Supabase-backed data layer with mock-data fallback for local development

## Tech stack

- Next.js 16.3.8
- React 19.2.8
- TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth + Storage)
- lucide-react
- React Hook Form + Zod
- Razorpay integration for visit/order flows

## Prerequisites

- Node.js 20+ recommended
- npm
- Supabase project
- Optional: Razorpay account for payment/booking flow

## Local setup

### 1) Clone the repository

```bash
git clone https://github.com/akhilkumar72665/PrimeHomeKanpur-Project.git
cd PrimeHomeKanpur-Project
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Required for server-side admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: configure both keys to enable Razorpay payments
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

Notes:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a legacy alias for the publishable key.
- Do not commit real credentials or secrets to version control.

### 4) Run the app

```bash
npm run dev
```

Then open http://localhost:3000

## Production build

```bash
npm run build
npm start
```

## Project structure

```text
PrimeHomeKanpur-Project/
├── src/
│   ├── app/                   # App Router pages and API routes
│   │   ├── admin/             # Admin dashboard and management modules
│   │   ├── api/               # APIs for contact, payments, newsletter, reports
│   │   ├── auth/              # Auth callback flow
│   │   ├── dashboard/         # Authenticated user dashboard
│   │   ├── landlord/          # Landlord-specific pages
│   │   ├── rentals/           # Listing and detail pages
│   │   ├── about/             # About page
│   │   ├── agents/            # Agents page
│   │   ├── contact/           # Contact form
│   │   ├── faq/               # FAQ page
│   │   ├── services/          # Services page
│   │   ├── signin/            # Sign-in page
│   │   ├── signup/            # Sign-up page
│   │   ├── forgot-password/   # Reset flow
│   │   ├── reset-password/    # Password reset UI
│   │   ├── globals.css       # App styles and theme tokens
│   │   ├── layout.tsx         # Root layout and metadata
│   │   ├── page.tsx           # Home page
│   │   └── ...
│   ├── components/            # Reusable UI, cards, layout, modals
│   ├── contexts/              # Auth context and shared app state
│   ├── lib/                   # Supabase clients, data access, rate limiting, utilities
│   ├── middleware.ts          # Request middleware and auth/session handling
│   ├── styles/                # Design tokens and legacy styles
│   ├── types/                 # Type definitions
│   └── ...
├── public/                    # Static assets
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

## App modules and flows

### Public website
- Homepage with property highlights and trusted stats
- Rentals browsing and filters
- Neighborhood and agent coverage pages
- Services and FAQ pages
- Contact form for tenant and landlord inquiries
- Policy and compliance pages

### Authenticated user experience
- Sign up / sign in / reset password
- Wishlist and saved properties
- My visits and bookings
- Reviews and ratings
- Profile, documents, and notifications management
- Security settings

### Admin experience
- Overview dashboard with counts and recent activity
- Review moderation workflow
- Inquiry management
- Team and user management
- Property and location administration
- Reports and verification controls
- Newsletter and activity tracking

## Database and backend notes

The app uses Supabase as the primary backend and data store. Queries are structured to read property, location, review, inquiry, user, and team data directly from Supabase tables.

The code includes fallback mock data for local development and for cases where the connected Supabase project has no seeded records yet. This is particularly useful when testing UI flows without a full database setup.

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub
2. Import it into Vercel
3. Add the required environment variables in the Vercel project settings
4. Deploy

### Other Node hosts

Build the app and serve the production output as usual:

```bash
npm run build
npm start
```

## Notes

- The project includes a real estate brand and commissioned local-market copy; the README intentionally omits private personal or contact details.
- This is a commercial site and should be treated as proprietary code unless your organization has specified a different license.

## Scripts

```bash
npm run dev      # start local development server
npm run build    # production build
npm start        # run production build
npm run lint     # run ESLint
```

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
