# PrimeHomeKanpur

A full-stack rental real estate platform for Kanpur, Uttar Pradesh, India. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Property Listings**: Browse verified rental properties across Kanpur
- **Advanced Search**: Filter by location, BHK, price range, and tenant type
- **Property Details**: View detailed information, amenities, and schedule visits
- **Agent Profiles**: Meet the team of rental experts
- **Services**: Complete rental services from search to move-in
- **FAQ**: Common questions about the rental process
- **Contact**: Get in touch with the team
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase project (free tier works)
- Git

## 🚦 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd primehomekanpur
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your credentials:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Database Migrations

Apply the database schema and RLS policies:

```bash
# Using Supabase CLI (recommended)
supabase db push

# Or manually in Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Run the migration files from supabase/migrations/ in order:
#    - 001_initial_schema.sql
#    - 002_rls_policies.sql
#    - 003_profile_trigger.sql
```

### 6. Seed the Database

Run the seed data to populate with sample properties, agents, FAQs, etc.:

```bash
# In Supabase SQL Editor, run:
# supabase/seed.sql
```

### 7. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
primehomekanpur/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── about/             # About page
│   │   ├── rentals/           # Rentals listing
│   │   ├── rentals/[slug]/    # Property details
│   │   ├── agents/            # Agents page
│   │   ├── services/          # Services page
│   │   ├── faq/               # FAQ page
│   │   ├── contact/           # Contact page
│   │   ├── privacy-policy/    # Privacy policy
│   │   ├── terms/             # Terms & conditions
│   │   └── cookie-policy/     # Cookie policy
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── ui/                # Reusable UI components
│   │   ├── cards/             # PropertyCard, AgentCard
│   │   └── sections/          # SectionHeading, etc.
│   ├── lib/
│   │   ├── supabase/          # Supabase client config
│   │   ├── data/              # Data access functions
│   │   └── utils.ts           # Utility functions
│   ├── styles/
│   │   └── tokens.css         # Design tokens
│   └── types/
│       └── index.ts           # TypeScript types
├── supabase/
│   ├── migrations/             # Database migrations
│   └── seed.sql               # Seed data
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Design System

The project uses a dark theme with purple/cyan accents:

- **Background**: Near-black (#07050F)
- **Surface**: Dark purple (#0E0A20)
- **Primary**: Cyan/turquoise (#00C2D9)
- **Accent**: Violet (#7C3AED)
- **Text**: White (#FFFFFF)

Design tokens are defined in `src/styles/tokens.css`.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Security

- Row Level Security (RLS) is enabled on all tables
- Service role key is never exposed to the client
- Environment variables are gitignored
- SQL injection protection via parameterized queries

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Hostinger

1. Build the project: `npm run build`
2. Upload the `.next` folder and `package.json`
3. Install dependencies on server
4. Set environment variables
5. Start with `npm start`

## 📝 Database Schema

The database includes the following tables:

- `profiles` - User profiles linked to auth.users
- `properties` - Rental property listings
- `property_images` - Property image references
- `amenities` - Available amenities
- `property_amenities` - Junction table for property-amenities
- `locations` - Kanpur neighborhoods
- `agents` - Agent profiles
- `inquiries` - Property inquiries
- `favorites` - User favorites
- `faqs` - Frequently asked questions
- `testimonials` - Client testimonials
- `contact_messages` - Contact form submissions
- `newsletter_subscribers` - Newsletter subscriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Push and create a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Contact

- **Email**: pathak424448@gmail.com
- **Phone**: +91 6398987290
- **Address**: Awadhpuri, Near Sales Tax Office, Kanpur – 208024

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
