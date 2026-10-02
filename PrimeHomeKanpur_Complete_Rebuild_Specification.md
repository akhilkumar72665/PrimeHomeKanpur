# PrimeHomeKanpur — Complete Rebuild Specification

## 1. Project Overview

**Project Name:** PrimeHomeKanpur  
**Industry:** Real Estate / Rental Properties  
**Primary Location:** Kanpur, Uttar Pradesh, India

PrimeHomeKanpur is a rental-property discovery platform focused on helping tenants find verified rental properties in Kanpur.

This project is a complete rebuild of the existing PrimeHomeKanpur website.

The existing website/reference screenshots are the **primary visual source of truth**.

### Objective

Rebuild the existing PrimeHomeKanpur website with the same visual identity, layout, sections, hierarchy, interactions, and user experience while replacing the old/unreliable implementation with a clean, scalable, maintainable, production-ready architecture.

---

# 2. Critical Product Rules

## 2.1 Visual Rule

The reference screenshots must be treated as the primary visual specification.

Do **not** redesign the website.

Do **not** replace the visual style with a generic real-estate template.

Do **not** introduce unrelated colors, layouts, typography, cards, or animations.

Preserve:

- Header
- Navigation
- Hero sections
- Section ordering
- Card layouts
- Typography hierarchy
- Purple/dark/cyan color system
- Gradients
- Borders
- Rounded corners
- Buttons
- Badges
- Property cards
- Agent cards
- Statistics
- CTA sections
- Footer
- Breadcrumbs
- Filters
- Responsive behavior

If a visible design decision in the screenshot conflicts with a generic best practice, prioritize the screenshot unless the change is necessary for functionality, accessibility, security, or responsiveness.

---

# 3. Business Model

PrimeHomeKanpur is an admin-managed rental platform.

There is **NO public property-owner marketplace** in this version.

## Users

Only two application roles are required:

1. `ADMIN`
2. `TENANT`

## No Owner Role

Do NOT create:

- Landlord registration
- Owner registration
- Owner dashboard
- Owner property upload
- Owner listing management
- Owner subscriptions
- Owner marketplace
- Public owner listing creation

All properties are created and managed by PrimeHomeKanpur administrators.

### Business Flow

```text
ADMIN
   |
   | Creates property
   v
PROPERTY DATABASE
   |
   | Publishes property
   v
PUBLIC RENTAL WEBSITE
   |
   | Tenant searches
   v
PROPERTY DETAILS
   |
   | Inquiry / Schedule Visit
   v
ADMIN / AGENT
```

---

# 4. Technology Requirements

Recommended production stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- GitHub
- Hostinger

Recommended libraries where appropriate:

- `@supabase/supabase-js`
- `@supabase/ssr`
- `react-hook-form`
- `zod`
- `lucide-react`

Use the existing framework if already established, but preserve the architecture and requirements in this document.

---

# 5. Visual Design System

The website should look:

- Premium
- Dark
- Modern
- Professional
- Local
- Real-estate focused
- Slightly futuristic
- Clean
- Trustworthy

The design must match the existing screenshots.

## Color System

Use centralized design tokens for:

```text
background
background-secondary
surface
surface-elevated
border
primary
primary-hover
accent
accent-hover
text-primary
text-secondary
text-muted
success
warning
error
```

Visual characteristics:

- Near-black backgrounds
- Deep navy
- Deep purple
- Violet gradients
- Cyan/turquoise accents
- White/off-white text
- Subtle pink/red/orange/blue property gradients

Do not introduce unrelated colors.

## Typography

Use a clean modern sans-serif font.

Maintain:

- Large bold hero headings
- Strong section headings
- Small eyebrow labels
- Compact body text
- Small metadata
- Strong button text

Typography should visually resemble the screenshots.

---

# 6. Global Layout

Use a centralized container system.

```text
Page
 ├── Header
 ├── Main
 │    ├── Hero
 │    ├── Sections
 │    └── CTA
 └── Footer
```

Avoid inconsistent page widths and section spacing.

---

# 7. Global Header

Create one reusable `Header` component.

Desktop navigation:

- Home
- About
- Rentals
- Agents
- Services
- FAQ
- Contact

Requirements:

- PrimeHomeKanpur logo
- Dark background
- Center navigation
- Cyan active navigation pill
- Right-side CTA
- Responsive mobile navigation
- Active route state
- Consistent spacing

Do not create separate headers for every page.

---

# 8. Global Footer

Create one reusable `Footer` component.

Include:

### Brand

PrimeHomeKanpur

### Contact

- Office address
- Email
- Phone

### Newsletter

Email subscription field.

### Navigation

- Home
- About
- Rentals
- Agents
- Services
- Contact

### Company

- About Us
- Our Team
- FAQs
- Support

### Legal

- Privacy Policy
- Terms & Conditions
- Cookie Policy

### Bottom

```text
© 2026 PrimeHomeKanpur. All rights reserved.
```

Also include Terms of Use and Privacy Policy.

Maintain the dark/purple footer card styling shown in the reference.

---

# 9. Global Hero

Create reusable:

- `PageHero`
- `HomeHero`
- `PropertyHero`

Inner-page hero should include:

- Dark background
- Purple/blue diagonal line pattern
- Gradient
- Eyebrow badge
- Large heading
- Cyan highlighted text
- Supporting text
- Breadcrumb

---

# 10. Public Routes

```text
/
/about
/rentals
/rentals/[slug]
/agents
/services
/faq
/contact
/privacy-policy
/terms
/cookie-policy
```

Authentication:

```text
/login
/register
/forgot-password
/reset-password
```

Tenant:

```text
/profile
/favorites
/my-inquiries
```

Admin:

```text
/admin
/admin/properties
/admin/properties/new
/admin/properties/[id]/edit
/admin/agents
/admin/inquiries
/admin/users
/admin/faqs
/admin/testimonials
/admin/settings
```

---

# 11. Home Page

Recreate the reference Home page.

## Section Order

1. Header
2. Hero
3. Search/filter area
4. Statistics
5. Featured/premium rentals
6. Working areas/neighborhoods
7. Testimonials
8. Why choose PrimeHomeKanpur
9. Services
10. Final CTA
11. Footer

### Hero

Use the existing concept:

> Find your next rental with PrimeHomeKanpur

Include:

- Large heading
- Cyan highlighted words
- Supporting text
- CTA
- Rental search

### Statistics

Use the same visual structure as the reference.

Potential metrics:

- Total listings
- Active areas
- Properties rented
- Satisfaction rate

### Featured Properties

Use reusable:

- `PropertyCard`
- `PropertyGrid`

Property card:

- Image
- Status badge
- Featured badge
- Price
- Title
- Location
- BHK
- Area
- Tenant type

Do not create different property-card implementations for different pages.

### Neighborhoods

Include areas such as:

- Gurudev Chauraha
- Kakadeo
- Vijay Nagar
- Vikas Nagar
- Awas Vikas
- Sharda Nagar
- Shastri Nagar
- Barra
- Panki
- Kidwai Nagar

Use the same colorful gradient treatment visible in the reference.

### Testimonials

Create:

- `TestimonialCard`
- `TestimonialSection`

Support:

- Customer quote
- Customer name
- Customer role
- Property/location
- Avatar/initial
- Active/inactive
- Ordering

### Why Choose Us

Use:

- Visual/image block
- Feature list
- Icons
- Cyan accents
- Dark purple surfaces

### Services Preview

Use the same composition as the reference.

Potential services:

- Find a Rental
- Property Verification
- Rental Assistance
- Site Visits
- Documentation Support
- Move-in Support

### Final CTA

Example:

> Ready to find your dream rental?

Use primary cyan and secondary purple buttons.

---

# 12. About Page

Route:

```text
/about
```

Sections:

1. Header
2. Hero
3. Story
4. Statistics
5. Mission & Values
6. Leadership
7. Why Choose Us
8. Testimonials
9. CTA
10. Footer

Hero heading:

> Connecting Kanpur families & professionals with their perfect home

Mission & values cards:

- Our Mission
- Our Vision
- Integrity First
- Client First

Leadership should use reusable team/agent cards.

---

# 13. Rentals Page

Route:

```text
/rentals
```

Hero:

> Find your perfect rental home in Kanpur

## Filters

- Location
- BHK
- Price range
- Tenant type
- Search

Optional:

- Property type
- Furnishing
- Availability

Filtering must query actual database data.

## Property Grid

Desktop: 4 columns where appropriate  
Tablet: 2 columns  
Mobile: 1 column

Example seed properties:

- Spacious 2BHK Apartment
- Cozy Studio Flat
- Luxurious 3BHK Duplex
- Modern 2BHK with Balcony
- Budget Friendly 1BHK
- Premium 3BHK Villa
- Newly Built 2BHK Flat
- Near Metro 1BHK
- Heritage 3BHK Apartment
- Park Facing 2BHK
- Compact 1BHK Flat
- 3BHK with Terrace Garden

These must be database seed records, not hardcoded inside components.

## Rental Process

Heading:

> Find your rental in 4 simple steps

Steps:

1. Browse Listings
2. Schedule Visit
3. Apply & Verify
4. Move In

---

# 14. Property Details Page

Route:

```text
/rentals/[slug]
```

Recreate the reference Property Details page.

Include:

- Property hero
- Gallery
- Price
- Quick facts
- Amenities
- Description
- Location advantages
- Map
- Agent card
- Schedule Visit form
- Tenant Tips
- Similar Properties
- Footer

## Gallery

Use:

```text
PropertyGallery
```

Support:

- Main image
- Thumbnails
- Responsive gallery
- Optional lightbox

Images should come from Supabase Storage in production.

## Quick Facts

Include:

- Bedrooms
- Bathrooms
- Area
- Floor

## Amenities

Examples:

- Parking
- Power Backup
- 24x7 Water
- Elevator
- High-Speed WiFi
- Balcony
- Security
- Washing Machine
- Modular Kitchen
- AC
- DTH Connection

## Schedule Visit

Fields:

- Full Name
- Phone Number
- Preferred Date
- Preferred Time
- Submit

Store in Supabase.

---

# 15. Agents Page

Route:

```text
/agents
```

Hero:

> Kanpur's most trusted rental experts, here for you

Desktop: 3 columns  
Tablet: 2 columns  
Mobile: 1 column

Agent cards include:

- Avatar
- Name
- Role
- Description
- Deals
- Rating
- Years
- Contact buttons

Agent data must be database-driven.

## Agent fields

```text
id
name
slug
role
description
avatar
phone
email
whatsapp
experience_years
deals_count
rating
years_active
specializations
areas
is_active
created_at
updated_at
```

Agent promise section:

> What working with a PrimeHomeKanpur agent actually means

Features:

- You'll never feel pressured
- They know the area like a local
- Fast, 24/7 responsiveness
- Bonus: free move-in support

---

# 16. Services Page

Route:

```text
/services
```

Use the same PrimeHomeKanpur design system.

Services may include:

1. Rental Search
2. Property Verification
3. Site Visit Assistance
4. Tenant Assistance
5. Documentation Support
6. Move-in Support

Do not create public owner marketplace functionality.

---

# 17. FAQ Page

Route:

```text
/faq
```

Include:

- Hero
- FAQ list
- Accordion
- CTA
- Footer

FAQ data must be database-driven.

Admin can:

- Create
- Edit
- Delete
- Activate/deactivate
- Reorder

---

# 18. Contact Page

Route:

```text
/contact
```

Include:

- Hero
- Office address
- Email
- Phone
- Contact form
- CTA
- Footer

Contact fields:

```text
name
email
phone
subject
message
```

Store submissions in Supabase.

---

# 19. Authentication

Use Supabase Auth.

Implement:

- Register
- Login
- Logout
- Forgot password
- Reset password
- Session persistence
- Email verification where configured

Never store raw passwords in custom tables.

---

# 20. User Profiles

Create:

```text
profiles
```

linked to:

```text
auth.users
```

Suggested fields:

```text
id
full_name
email
phone
avatar_url
role
is_active
created_at
updated_at
```

Roles:

```text
ADMIN
TENANT
```

---

# 21. Favorites

Authenticated tenants can:

- Add favorite
- Remove favorite
- View favorites

Table:

```text
favorites
```

Unique constraint:

```text
user_id + property_id
```

Users must never modify another user's favorites.

---

# 22. Inquiries

Tenant can submit:

- Property
- Name
- Phone
- Message
- Preferred date
- Preferred time

Table:

```text
inquiries
```

Statuses:

```text
NEW
CONTACTED
VISIT_SCHEDULED
IN_PROGRESS
CLOSED
```

Admin can manage inquiry status.

---

# 23. Database Structure

Use Supabase PostgreSQL.

Recommended tables:

```text
profiles
properties
property_images
amenities
property_amenities
locations
favorites
inquiries
agents
faqs
testimonials
contact_messages
newsletter_subscribers
```

Add supporting tables only when necessary.

---

# 24. Properties Table

Recommended fields:

```text
id
slug
title
description
price
security_deposit
maintenance
property_type
bhk
bathrooms
area_sqft
floor
total_floors
tenant_type
furnishing
status
location_id
address
latitude
longitude
featured
available_from
created_at
updated_at
```

Suggested statuses:

```text
DRAFT
AVAILABLE
RESERVED
RENTED
INACTIVE
```

Only appropriate properties should be publicly visible.

---

# 25. Property Images

Use Supabase Storage.

Bucket:

```text
property-images
```

Suggested structure:

```text
property-images/
  {property-id}/
    01.webp
    02.webp
    03.webp
    04.webp
```

Store metadata/reference in:

```text
property_images
```

Do not store large image binaries in PostgreSQL.

---

# 26. Locations

Use:

```text
locations
```

Suggested fields:

```text
id
name
slug
city
description
image
is_active
created_at
updated_at
```

---

# 27. Amenities

Use:

```text
amenities
property_amenities
```

Examples:

- Parking
- Power Backup
- Elevator
- 24x7 Water
- Security
- Balcony
- WiFi
- AC
- Modular Kitchen
- Washing Machine

---

# 28. RLS and Security

Enable Row Level Security.

## Public

Can read only public/published property data.

## Tenant

Can:

- Read own profile
- Update own profile
- Create own inquiries
- Read own inquiries
- Create own favorites
- Delete own favorites

## Admin

Can manage authorized administrative data.

Do not rely only on frontend role checks.

Authorization must also be enforced at database/server level.

---

# 29. Supabase Client Architecture

Use:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
```

Rules:

- `client.ts`: browser client
- `server.ts`: authenticated server client
- `admin.ts`: server-only privileged client if genuinely required

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

---

# 30. Environment Variables

Create:

```text
.env.example
```

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Only use the service-role key server-side.

Use:

```text
.env.local
```

for local development.

Never commit real credentials.

---

# 31. GitHub

Prepare:

```text
.gitignore
README.md
```

`.gitignore` should include:

```text
node_modules
.next
dist
build
coverage
.env
.env.local
.env.*.local
logs
.DS_Store
Thumbs.db
```

Never commit:

- API keys
- Passwords
- Supabase service-role keys
- Private credentials
- Local environment files

---

# 32. Project Folder Structure

Use a clean structure similar to:

```text
primehomekanpur/
│
├── public/
│   ├── icons/
│   ├── logos/
│   └── placeholders/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── rentals/page.tsx
│   │   ├── rentals/[slug]/page.tsx
│   │   ├── agents/page.tsx
│   │   ├── services/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── favorites/page.tsx
│   │   ├── my-inquiries/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── cookie-policy/page.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── properties/
│   │       ├── agents/
│   │       ├── inquiries/
│   │       ├── users/
│   │       ├── faqs/
│   │       ├── testimonials/
│   │       └── settings/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── property/
│   │   ├── rentals/
│   │   ├── agents/
│   │   ├── about/
│   │   ├── common/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── services/
│   │   ├── validations/
│   │   └── utils/
│   │
│   ├── types/
│   ├── config/
│   └── styles/
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_profiles.sql
│   │   ├── 003_locations.sql
│   │   ├── 004_properties.sql
│   │   ├── 005_property_images.sql
│   │   ├── 006_amenities.sql
│   │   ├── 007_agents.sql
│   │   ├── 008_favorites.sql
│   │   ├── 009_inquiries.sql
│   │   ├── 010_content.sql
│   │   ├── 011_storage.sql
│   │   └── 012_rls.sql
│   └── seed.sql
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── security.md
│   ├── environment.md
│   └── deployment.md
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

Adapt the exact structure to the chosen framework if necessary, but preserve separation of concerns.

---

# 33. Component Architecture

Important reusable components include:

```text
Header
Footer
MobileMenu
PageHero
Breadcrumbs
PropertyCard
PropertyGrid
PropertyGallery
PropertyFacts
PropertyAmenities
PropertyDescription
PropertyLocation
SimilarProperties
PropertyInquiryForm
AgentCard
AgentGrid
RentalFilters
RentalGrid
RentalSteps
TestimonialCard
SectionHeading
Button
Badge
Loading
EmptyState
ErrorState
Modal
```

Each component should have one clear responsibility.

---

# 34. No Monolithic Files

Do not create:

- 1000+ line page components
- Giant CSS files
- Giant API files
- Giant database files
- Duplicate components
- Duplicate cards
- Duplicate headers
- Duplicate footers

Pages should compose reusable components.

---

# 35. Data Access Layer

Do not randomly call Supabase inside UI components.

Use:

```text
UI
 ↓
Service Layer
 ↓
Supabase
 ↓
PostgreSQL
```

Example service files:

```text
properties.ts
agents.ts
favorites.ts
inquiries.ts
locations.ts
faqs.ts
testimonials.ts
contact.ts
newsletter.ts
```

---

# 36. TypeScript Rules

Use strict TypeScript.

Avoid `any` unless absolutely necessary.

Use:

- Interfaces
- Types
- Database-generated types
- Reusable domain types

---

# 37. Validation

Use Zod and React Hook Form where appropriate.

Validate:

- Email
- Phone
- Required fields
- Dates
- Prices
- Property fields
- Inquiry forms
- Contact forms
- Admin forms

---

# 38. Loading / Empty / Error States

Every database-dependent section must have:

### Loading

Skeleton/spinner matching the visual system.

### Empty

Examples:

```text
No properties found
No favorites yet
No inquiries yet
No agents available
No FAQs available
```

### Error

Examples:

```text
Failed to load properties.
Please try again.
```

Never expose SQL errors, stack traces, secrets, or internal infrastructure information.

---

# 39. SEO

Implement:

- Page titles
- Meta descriptions
- Open Graph metadata
- Canonical URLs
- Dynamic property metadata
- Semantic HTML
- Alt text
- Sitemap
- Robots configuration
- Structured data where appropriate

SEO must not alter the visual design.

---

# 40. Accessibility

Implement:

- Keyboard navigation
- Focus states
- Accessible labels
- Form labels
- Alt text
- Semantic buttons
- Correct heading hierarchy
- ARIA where necessary

Maintain the reference visual appearance.

---

# 41. Responsive Design

Desktop should closely match the screenshots first.

Then adapt to:

- Tablet
- Mobile

Do not redesign mobile as a separate product.

Only adapt:

- Grid columns
- Spacing
- Typography
- Navigation
- Image sizes
- Layout stacking

---

# 42. Animation

Use subtle animations only.

Allowed:

- Hover
- Fade
- Small transform
- Button interaction
- Card interaction
- Page transition

Avoid:

- Excessive parallax
- Heavy 3D
- Particle systems
- Constant moving backgrounds
- Distracting animations

---

# 43. Image Strategy

The reference screenshots use gradient/placeholder-like imagery.

Do not insert unrelated stock photography that changes the appearance.

If actual property images are unavailable:

- Use visually similar gradient/image placeholders.
- Keep image dimensions consistent.
- Make the architecture ready for real Supabase Storage images.

---

# 44. Admin Dashboard

The admin dashboard can use a practical dashboard layout while preserving PrimeHomeKanpur branding.

Modules:

```text
Dashboard
Properties
Agents
Inquiries
Users
FAQs
Testimonials
Settings
```

---

# 45. Admin Property Management

Admin can:

- Create property
- Edit property
- Delete property
- Save draft
- Publish
- Unpublish
- Mark rented
- Mark available
- Upload images
- Delete images
- Reorder images
- Manage amenities
- Manage price
- Manage location
- Manage BHK
- Manage tenant type
- Manage furnishing
- Manage availability

---

# 46. Admin Agent Management

Admin can:

- Add agent
- Edit agent
- Delete agent
- Activate/deactivate
- Update statistics
- Upload avatar
- Update contact details
- Assign neighborhoods/specializations

---

# 47. Admin Inquiry Management

Admin can:

- View inquiries
- Filter inquiries
- Search inquiries
- View tenant details
- View property
- Update inquiry status
- Add internal notes if implemented

---

# 48. Admin FAQ Management

Admin can:

- Add FAQ
- Edit FAQ
- Delete FAQ
- Activate/deactivate
- Reorder

---

# 49. Admin Testimonial Management

Admin can:

- Add testimonial
- Edit testimonial
- Delete testimonial
- Activate/deactivate
- Reorder

---

# 50. Performance

Optimize:

- Images
- Database queries
- Server/client boundaries
- Fonts
- Bundle size
- Lazy loading
- Caching/revalidation where appropriate

Prefer server-side rendering/server components where supported.

Use client components only where interactivity requires them.

---

# 51. File Upload Security

For property images validate:

- MIME type
- Extension
- File size
- Image dimensions where appropriate

Allowed formats:

```text
JPG
JPEG
PNG
WEBP
```

Do not allow arbitrary executable files.

---

# 52. GitHub Workflow

Recommended:

```text
Local Development
        ↓
Git
        ↓
GitHub
        ↓
Production Deployment
```

Use meaningful commits.

Examples:

```text
feat: add property management
fix: repair rental filters
refactor: organize property services
style: match rental card design
docs: add deployment instructions
```

---

# 53. Documentation

Create:

```text
docs/architecture.md
docs/database.md
docs/security.md
docs/environment.md
docs/deployment.md
```

## architecture.md

Explain:

- Folder structure
- Components
- Service layer
- Routing
- Authentication

## database.md

Explain:

- Tables
- Relationships
- Indexes
- RLS
- Storage

## security.md

Explain:

- Authentication
- Roles
- RLS
- Secrets
- File upload security

## environment.md

Explain:

- Environment variables
- Local setup
- Production variables

## deployment.md

Explain:

- Build
- Hostinger deployment
- Environment variables
- Supabase configuration
- Production checks

---

# 54. README

README must include:

```text
Project Overview
Features
Tech Stack
Folder Structure
Installation
Environment Variables
Supabase Setup
Database Setup
Storage Setup
Authentication Setup
Admin Setup
Development
Build
Production
Deployment
Security
Troubleshooting
```

---

# 55. Seed Data

Create seed data for:

- Properties
- Locations
- Agents
- FAQs
- Testimonials
- Amenities

Seed content should visually reproduce the reference website.

---

# 56. Search and Filtering

Search/filter must be real.

When users select:

```text
Location
BHK
Price
Tenant Type
```

the application must query/filter actual property data.

Do not merely change the UI.

---

# 57. Property URLs

Use readable slugs.

Example:

```text
/rentals/modern-2bhk-with-balcony
```

Avoid unnecessary random IDs in public URLs.

---

# 58. No Duplicate Data

Do not duplicate the same:

- Property
- Agent
- Location
- FAQ
- Testimonial

across multiple files.

Store content in Supabase.

UI consumes database data.

---

# 59. No Dead Code

Remove:

- Unused components
- Duplicate components
- Dead CSS
- Unused dependencies
- Old API routes
- Temporary files
- Unused mock data
- Debug files
- Obsolete assets

Do not delete anything required by the final application.

---

# 60. Visual QA

For every reference page:

1. Run the application.
2. Open the page.
3. Compare against screenshot.
4. Check:
   - Width
   - Spacing
   - Typography
   - Colors
   - Gradients
   - Card size
   - Borders
   - Buttons
   - Images
   - Section order
   - Footer
5. Correct differences.
6. Repeat.

---

# 61. Functional QA

Test:

- Navigation
- Mobile menu
- Search
- Filters
- Property detail routing
- Authentication
- Logout
- Favorites
- Inquiry form
- Contact form
- Newsletter
- Admin login
- Property CRUD
- Agent CRUD
- FAQ CRUD
- Testimonial CRUD
- Image upload
- RLS
- Unauthorized access
- Error states
- Empty states

---

# 62. Build QA

The project must successfully run:

```bash
npm install
npm run dev
npm run build
npm start
```

Requirements:

- No unresolved TypeScript errors
- No critical console errors
- No broken routes
- No missing production environment variables
- Production build succeeds

---

# 63. Final Acceptance Checklist

## Visual

- [ ] Home matches reference
- [ ] About matches reference
- [ ] Rentals matches reference
- [ ] Property Details matches reference
- [ ] Agents matches reference
- [ ] Services follows same visual system
- [ ] FAQ follows same visual system
- [ ] Contact follows same visual system
- [ ] Header consistent
- [ ] Footer consistent
- [ ] Cards consistent
- [ ] Colors consistent
- [ ] Typography consistent
- [ ] Mobile responsive

## Functionality

- [ ] Navigation works
- [ ] Search works
- [ ] Filters work
- [ ] Property details work
- [ ] Authentication works
- [ ] Favorites work
- [ ] Inquiry works
- [ ] Contact form works
- [ ] Admin login works
- [ ] Property CRUD works
- [ ] Agent CRUD works
- [ ] FAQ CRUD works
- [ ] Testimonials CRUD works
- [ ] Image upload works

## Supabase

- [ ] Database configured
- [ ] Migrations created
- [ ] Seed data created
- [ ] Storage configured
- [ ] Auth configured
- [ ] RLS enabled
- [ ] RLS policies tested
- [ ] Database types available

## Security

- [ ] No secrets in Git
- [ ] Service role key server-only
- [ ] Admin routes protected
- [ ] Input validation implemented
- [ ] File upload validation implemented
- [ ] RLS tested

## Code Quality

- [ ] No duplicate components
- [ ] No dead code
- [ ] No giant page files
- [ ] No unnecessary dependencies
- [ ] Clear folder structure
- [ ] TypeScript used properly
- [ ] Service layer implemented
- [ ] Reusable components implemented

## Documentation

- [ ] README
- [ ] Architecture documentation
- [ ] Database documentation
- [ ] Security documentation
- [ ] Environment documentation
- [ ] Deployment documentation

## Deployment

- [ ] Production build succeeds
- [ ] Environment variables documented
- [ ] Hostinger-compatible
- [ ] Supabase production project configured
- [ ] GitHub repository clean
- [ ] Domain can be connected later

---

# 64. Implementation Order

## Phase 1 — Foundation

- Project initialization
- Dependencies
- TypeScript
- Tailwind/design tokens
- Global CSS
- Folder structure

## Phase 2 — Global UI

- Header
- Footer
- Buttons
- Badges
- Section headings
- Hero
- Breadcrumbs

## Phase 3 — Public Pages

- Home
- Rentals
- Property Details
- Agents
- About
- Services
- FAQ
- Contact

## Phase 4 — Supabase

- Project connection
- Database
- Migrations
- Seed data
- Storage
- Auth

## Phase 5 — Dynamic Features

- Property queries
- Filters
- Property details
- Favorites
- Inquiries
- Contact messages
- Newsletter

## Phase 6 — Admin

- Admin authentication
- Dashboard
- Property management
- Agent management
- Inquiry management
- FAQ management
- Testimonial management

## Phase 7 — Security

- RLS
- Authorization
- Input validation
- File upload security
- Secret protection

## Phase 8 — QA

- Visual QA
- Responsive QA
- Functional QA
- Security QA
- Build QA

## Phase 9 — Deployment

- GitHub
- Production environment
- Supabase production configuration
- Hostinger deployment
- Final testing

---

# 65. Most Important Development Rule

Do not create the project as a collection of random pages.

Build it as a system:

```text
Pages
   ↓
Reusable Components
   ↓
Service Layer
   ↓
Supabase
   ↓
PostgreSQL / Storage / Auth
```

The screenshots represent the old PrimeHomeKanpur website.

The goal is **not** to create a better-looking or completely different real-estate website.

The goal is:

> Rebuild the existing PrimeHomeKanpur website so that it looks and behaves like the old website while fixing its architecture, organization, database integration, security, maintainability, and deployment readiness.

Therefore:

**VISUAL REFERENCE > PERSONAL DESIGN PREFERENCE**

When the screenshot clearly shows something, reproduce it.

When the screenshot does not specify a technical implementation detail, choose the cleanest production-grade implementation.

---

# 66. Final Expected Result

The completed project should provide:

```text
PrimeHomeKanpur
│
├── Public Rental Website
├── Tenant Features
├── Admin Dashboard
├── Supabase Database
├── Supabase Authentication
├── Supabase Storage
├── Secure RLS
├── GitHub-ready Repository
├── Hostinger-ready Deployment
└── Complete Documentation
```

The public website must remain visually faithful to the existing PrimeHomeKanpur reference screenshots.

The source code must be significantly more organized, maintainable, scalable, secure, and easier to navigate than the old implementation.
