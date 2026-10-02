You are an expert senior UI/UX designer, frontend engineer, full-stack developer, software architect, database architect, and production-grade web application developer.

Build a complete production-ready website for:

PROJECT NAME:
PrimeHomeKanpur

BUSINESS:
Real-estate rental platform focused on Kanpur.

IMPORTANT:
This is a REBUILD of an existing/old website.

The attached reference screenshots are the OLD WEBSITE and are the PRIMARY VISUAL SOURCE OF TRUTH.

The new website MUST look and feel like the old website shown in the reference screenshots.

DO NOT redesign it.
DO NOT modernize it into a different style.
DO NOT change the visual identity.
DO NOT introduce a new color palette.
DO NOT change the layout unnecessarily.
DO NOT replace the design with generic SaaS/real-estate templates.
DO NOT make it look like Housing.com, Airbnb, Zillow, etc.

The goal is:

"Rebuild the old PrimeHomeKanpur website with the SAME visual appearance and user experience, but with a clean, maintainable, properly structured, production-ready codebase."

==================================================
1. REFERENCE IMAGES — ABSOLUTE SOURCE OF TRUTH
==================================================

Use all attached reference screenshots carefully.

Reference pages include:

1. Home Page
2. About Page
3. Rentals / Rental Listings Page
4. Agents Page
5. Property Details Page

These screenshots represent the existing website.

Preserve:

- Overall visual identity
- Dark background
- Purple sections
- Cyan/turquoise accent color
- Gradient elements
- Card styling
- Borders
- Rounded corners
- Typography hierarchy
- Spacing
- Section order
- Navigation structure
- Buttons
- Badges
- Property cards
- Agent cards
- Footer
- CTA sections
- Grid layouts
- Hero sections
- Breadcrumbs
- Filters
- Statistics
- Icons
- Content hierarchy
- Visual rhythm
- Desktop proportions
- Overall page density

Do not replace the design with a different design system.

The screenshots should be treated as pixel-level visual references.

==================================================
2. BRAND IDENTITY
==================================================

Brand:

PrimeHomeKanpur

Industry:

Real Estate / Rental Properties

Location:

Kanpur, Uttar Pradesh, India

Primary visual style:

- Premium
- Dark
- Modern
- Professional
- Local real-estate brand
- Slight futuristic/tech-inspired visual language

Main colors should closely reproduce the reference website:

- Near-black background
- Deep navy/black
- Deep purple
- Violet/purple gradients
- Cyan/turquoise
- White/off-white typography
- Subtle pink/red/orange/blue gradients where visible in property cards

DO NOT introduce unrelated colors.

Maintain the same visual contrast as the screenshots.

==================================================
3. GLOBAL DESIGN SYSTEM
==================================================

Create a centralized design system.

Do NOT hardcode random colors throughout components.

Create centralized variables/tokens for:

- Background
- Surface
- Surface elevated
- Border
- Primary
- Primary hover
- Accent
- Text primary
- Text secondary
- Muted text
- Success
- Warning
- Error
- Radius
- Shadows
- Spacing
- Typography

Example architecture:

src/
  styles/
    globals.css
    tokens.css

or equivalent depending on framework.

The actual values must be tuned to visually match the reference screenshots.

==================================================
4. TYPOGRAPHY
==================================================

Typography should closely match the screenshots.

Use a clean modern sans-serif font.

Maintain:

- Bold large hero headings
- Medium section headings
- Small uppercase eyebrow labels
- Compact body text
- Small metadata text
- Strong button typography

Typography hierarchy must remain consistent throughout the site.

Do not randomly change font sizes between pages.

==================================================
5. GLOBAL HEADER
==================================================

Create ONE reusable Header component.

The header must match the reference screenshots.

Desktop navigation:

- Home
- About
- Rentals
- Agents
- Services
- FAQ
- Contact

Right-side CTA changes depending on page/context as shown in references, but maintain the same visual treatment.

Header requirements:

- Dark background
- PrimeHomeKanpur logo/brand on left
- Navigation centered
- Active navigation item uses cyan/turquoise pill style
- CTA on right
- Proper spacing
- Subtle border/divider if present
- Sticky/fixed behavior only if it matches the existing implementation
- Mobile hamburger menu
- Mobile navigation drawer/dropdown
- Active route indication

DO NOT create different header designs for every page.

Use one reusable Header component with configurable CTA text if necessary.

==================================================
6. GLOBAL FOOTER
==================================================

Create one reusable Footer component.

It must closely match the screenshots.

Footer structure:

LEFT:
PrimeHomeKanpur logo/brand
Short company description
Social icons

MIDDLE:
Address

CONTACT:
Email
Phone

LOWER SECTION:

Newsletter subscription

Navigation:

- Home
- About
- Rentals
- Agents
- Services
- Contact

Company:

- About Us
- Our Team
- FAQs
- Support

Legal:

- Privacy Policy
- Terms & Conditions
- Cookie Policy

Bottom copyright:

© 2026 PrimeHomeKanpur. All rights reserved.

Terms of Use
Privacy Policy

Maintain the same dark/purple footer card styling visible in the reference.

==================================================
7. GLOBAL HERO / INNER PAGE HERO
==================================================

Create reusable Hero components.

The inner-page hero must reproduce the existing style:

- Dark background
- Purple/blue diagonal line pattern
- Subtle gradient
- Small pill/eyebrow
- Large white heading
- Cyan highlighted phrase
- Short description
- Breadcrumb

Use reusable variants:

PageHero
PropertyHero
HomeHero

Do not create unrelated hero designs.

==================================================
8. PAGE STRUCTURE
==================================================

Create the following public pages:

/
 /about
 /rentals
 /rentals/[slug]
 /agents
 /services
 /faq
 /contact

Also create required utility pages:

/privacy-policy
/terms
/cookie-policy

Authentication routes if required:

/login
/register
/forgot-password
/reset-password

Admin routes:

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

Admin routes should not alter the public website design.

==================================================
9. HOME PAGE
==================================================

Recreate the Home Page from the attached reference image.

Maintain the same section order and visual hierarchy.

Sections include the visual patterns shown in the reference:

1. Header

2. Hero
   - PrimeHomeKanpur branding
   - "Find your next rental with PrimeHomeKanpur"
   - Cyan highlighted text
   - Supporting text
   - Primary CTA
   - Rental search/filter area

3. Statistics strip
   - Listings
   - Active areas
   - etc.
   Use the same visual structure as the reference.

4. Premium rental/property section
   - Section heading
   - CTA
   - Property card grid
   - Same card proportions
   - Same badge placement
   - Same pricing placement
   - Same metadata structure

5. Working areas / neighborhoods section
   - Neighborhood cards
   - Same colorful gradient treatment
   - Same grid structure

6. Client success stories / testimonials section
   - Same visual structure
   - Featured testimonial
   - Supporting testimonial cards

7. Why choose our rental expertise
   - Image/visual block
   - Feature list
   - Icons
   - Same split layout

8. Rental services section
   - 3 service cards
   - Same card styling
   - Same CTA placement

9. Final CTA

10. Footer

Do not reorder these sections.

==================================================
10. ABOUT PAGE
==================================================

Recreate the About page from the reference screenshot.

Sections:

1. Header

2. About hero
   Heading:
   "Connecting Kanpur families & professionals with their perfect home"

3. Story section
   - Large visual block
   - Story content
   - Same split layout

4. Statistics section

5. Mission & Values

Cards:

- Our Mission
- Our Vision
- Integrity First
- Client First

6. Leadership/team preview

Same card style as screenshot.

7. Why Choose Us section

8. Client testimonials

9. Final CTA

10. Footer

Preserve the same visual hierarchy.

==================================================
11. RENTALS PAGE
==================================================

Recreate the Rentals page exactly according to the reference screenshot.

Hero:

"Find your perfect rental home in Kanpur"

Search/filter panel:

- Location
- BHK
- Price range
- Tenant type
- Search button

Property section:

"All Rental Properties"

Property grid should match screenshot.

Desktop:

4 property cards per row where appropriate.

Tablet/mobile:

Responsive adaptation without changing the fundamental card design.

Each property card should include:

- Property image
- Status badge
- Featured badge if applicable
- Price/month
- Property title
- Location
- BHK
- Area
- Tenant type

Examples from reference:

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

Use database-driven content in production.

Do NOT hardcode properties inside UI components.

Then:

"Find your rental in 4 simple steps"

Steps:

1. Browse Listings
2. Schedule Visit
3. Apply & Verify
4. Move In

Then CTA section.

Then Footer.

==================================================
12. PROPERTY DETAILS PAGE
==================================================

Recreate the Property Details page from the reference.

URL:

/rentals/[slug]

Hero:

Property title

Location

Availability status

Breadcrumb

Main property gallery:

- Large primary image
- Thumbnail gallery
- Same proportions and layout
- Responsive gallery

Main information layout:

LEFT:

- Price
- Quick facts
- Amenities
- Property description
- Location advantages
- Map/location section

RIGHT:

Agent card
- Agent avatar
- Name
- Role
- Experience
- Call Agent
- Email Agent
- WhatsApp

Schedule a Visit form:

- Full Name
- Phone Number
- Preferred Date
- Preferred Time
- Schedule Tour button

Tenant Tips section.

Then:

"You might also like these"

Property recommendation grid.

Footer.

==================================================
13. AGENTS PAGE
==================================================

Recreate the Agents page from the reference screenshot.

Hero:

"Kanpur's most trusted rental experts, here for you"

Agent listing section:

"The people who'll help you find your next home"

Agent cards:

- Avatar/initial
- Name
- Role
- Description
- Deals
- Rating
- Years
- Phone button
- Message/contact button

Agent grid:

Desktop:
3 columns

Responsive:
2 columns tablet
1 column mobile

Use database-driven agent data.

Do not hardcode agent data directly inside components.

Neighborhood section:

"Every neighborhood in Kanpur, covered"

Grid of neighborhoods:

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

Then:

"What working with a PrimeHomeKanpur agent actually means"

Feature list:

- You'll never feel pressured
- They know the area like a local
- Fast, 24/7 responsiveness
- Bonus: free move-in support

Then CTA:

"Want to work with a specific agent?"

Then Footer.

==================================================
14. SERVICES PAGE
==================================================

Create Services page using EXACTLY the same visual language as the reference website.

Do not invent a new design.

Services should be presented as rental-focused services.

Possible content structure based on the existing website:

- Find a Rental
- List / Manage Rental (ADMIN ONLY if applicable)
- Property Verification
- Rental Assistance
- Site Visits
- Tenant Support
- Documentation Assistance
- Move-in Support

IMPORTANT:

There is NO public property-owner marketplace.

PrimeHomeKanpur itself/admin controls property listings.

Do not create a landlord dashboard.

Do not create "owner posts property" functionality.

==================================================
15. FAQ PAGE
==================================================

Create FAQ page using the same:

- Hero
- Dark background
- Purple sections
- Cyan accent
- Card design
- Typography
- Footer

FAQ data must be database-driven.

Admin can:

- Add FAQ
- Edit FAQ
- Delete FAQ
- Activate/deactivate FAQ
- Change display order

Public users can:

- View FAQs
- Expand/collapse answers
- Search/filter FAQs if included in existing design

==================================================
16. CONTACT PAGE
==================================================

Create Contact page using the existing visual language.

Include:

- Hero
- Contact information
- Email
- Phone
- Office address
- Contact form
- CTA
- Footer

Contact form fields:

- Name
- Email
- Phone
- Subject
- Message

Form submissions must be stored in Supabase.

==================================================
17. AUTHENTICATION
==================================================

Use Supabase Auth.

Implement:

- Register
- Login
- Logout
- Forgot password
- Password reset
- Session persistence
- Email verification where configured

Use:

@supabase/supabase-js

and:

@supabase/ssr

for Next.js SSR/session handling.

Never store raw passwords in custom database tables.

==================================================
18. USER ROLES
==================================================

Only use these application roles:

ADMIN
TENANT

DO NOT create a property-owner role.

Property owners are NOT part of this version.

All properties are managed/listed by PrimeHomeKanpur admin.

Role architecture:

auth.users
     |
     v
profiles
     |
     +---- ADMIN
     |
     +---- TENANT

==================================================
19. ADMIN PANEL
==================================================

Create a separate clean admin dashboard.

The admin panel does NOT need to visually replicate the public website pixel-for-pixel.

However, it must use the same brand identity.

Admin can manage:

PROPERTY MANAGEMENT:

- Create property
- Edit property
- Delete property
- Publish property
- Unpublish property
- Mark rented
- Mark available
- Upload property images
- Manage property gallery
- Manage amenities
- Manage pricing
- Manage location
- Manage BHK
- Manage property type
- Manage tenant type

AGENTS:

- Add agent
- Edit agent
- Delete agent
- Activate/deactivate agent
- Update agent stats
- Upload agent avatar

INQUIRIES:

- View inquiries
- Filter inquiries
- Change status
- View user details
- View property details

FAQ:

- CRUD
- Ordering
- Active/inactive

TESTIMONIALS:

- CRUD
- Active/inactive
- Ordering

USERS:

- View users
- View profile
- Manage account status if required

==================================================
20. DATABASE
==================================================

Use Supabase PostgreSQL.

Create a clean normalized database structure.

Recommended structure:

profiles
properties
property_images
property_amenities
amenities
locations
favorites
inquiries
agents
agent_stats
faqs
testimonials
contact_messages
newsletter_subscribers

If an existing schema already exists, preserve the existing naming and relationships where possible instead of creating duplicate tables.

==================================================
21. PROPERTY DATABASE MODEL
==================================================

Property should support:

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

Use proper types and constraints.

==================================================
22. PROPERTY IMAGE STORAGE
==================================================

Use Supabase Storage.

Bucket:

property-images

Recommended structure:

property-images/
  {property-id}/
    01.webp
    02.webp
    03.webp
    04.webp

Store image metadata/reference in:

property_images

Do not store huge image binaries directly in PostgreSQL.

==================================================
23. AGENT DATABASE
==================================================

Agent fields:

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

Use database-driven rendering.

==================================================
24. NEIGHBORHOODS
==================================================

Neighborhood data should be manageable rather than duplicated throughout components.

Use:

locations

Example:

Gurudev Chauraha
Kakadeo
Vijay Nagar
Vikas Nagar
Awas Vikas
Sharda Nagar
Shastri Nagar
Barra
Panki
Kidwai Nagar
etc.

==================================================
25. FAVORITES
==================================================

Authenticated tenant can:

- Add favorite
- Remove favorite
- View favorites

Database:

favorites

with unique:

user_id + property_id

Do not allow a tenant to manipulate another tenant's favorites.

==================================================
26. PROPERTY INQUIRIES
==================================================

Tenant can submit:

- Property
- Name
- Phone
- Message
- Preferred date
- Preferred time

Store in:

inquiries

Admin can manage inquiry status.

Example:

NEW
CONTACTED
VISIT_SCHEDULED
IN_PROGRESS
CLOSED

==================================================
27. RLS SECURITY
==================================================

Enable Row Level Security.

Public users:

Can read only public/published property information.

Authenticated tenant:

Can:
- Read/update own profile
- Read own inquiries
- Create inquiries
- Read own favorites
- Create/delete own favorites

Admin:

Can manage appropriate administrative data.

Never rely only on frontend role checks.

Authorization must also be enforced at database/server level.

==================================================
28. SECURITY
==================================================

NEVER expose:

SUPABASE_SERVICE_ROLE_KEY

to browser/client-side code.

Never place secrets inside:

- React components
- client JavaScript
- public folder
- GitHub
- NEXT_PUBLIC variables

Use:

.env.local

for local secrets.

Provide:

.env.example

without actual credentials.

==================================================
29. SUPABASE FILE STRUCTURE
==================================================

Use an organized structure similar to:

supabase/
  migrations/
    001_initial_schema.sql
    002_profiles.sql
    003_properties.sql
    004_agents.sql
    005_inquiries.sql
    006_favorites.sql
    007_content.sql
    008_storage.sql
    009_rls.sql
  seed.sql

Do not put all database SQL in one giant unstructured file.

==================================================
30. FRONTEND ARCHITECTURE
==================================================

Use reusable components.

Recommended:

src/
  app/
    page.tsx
    about/
      page.tsx
    rentals/
      page.tsx
      [slug]/
        page.tsx
    agents/
      page.tsx
    services/
      page.tsx
    faq/
      page.tsx
    contact/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx
    reset-password/
      page.tsx
    admin/
      page.tsx
      properties/
      agents/
      inquiries/
      users/
      faqs/
      testimonials/
      settings/

  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
      PageHero.tsx
      Breadcrumbs.tsx

    home/
      Hero.tsx
      StatsStrip.tsx
      FeaturedProperties.tsx
      Neighborhoods.tsx
      Testimonials.tsx
      WhyChooseUs.tsx
      ServicesPreview.tsx
      FinalCTA.tsx

    property/
      PropertyCard.tsx
      PropertyGrid.tsx
      PropertyGallery.tsx
      PropertyFacts.tsx
      PropertyAmenities.tsx
      PropertyDescription.tsx
      PropertyLocation.tsx
      SimilarProperties.tsx
      PropertyInquiryForm.tsx

    agents/
      AgentCard.tsx
      AgentGrid.tsx
      AgentStats.tsx
      AgentCTA.tsx

    rentals/
      RentalFilters.tsx
      RentalGrid.tsx
      RentalSteps.tsx

    about/
      StorySection.tsx
      MissionValues.tsx
      Leadership.tsx
      WhyChooseUs.tsx

    common/
      Button.tsx
      Badge.tsx
      SectionHeading.tsx
      Icon.tsx
      Loading.tsx
      EmptyState.tsx
      ErrorState.tsx
      Modal.tsx

  lib/
    supabase/
      client.ts
      server.ts
      admin.ts

    services/
      properties.ts
      agents.ts
      inquiries.ts
      favorites.ts
      locations.ts
      faqs.ts
      testimonials.ts
      contact.ts

    validations/
      property.ts
      inquiry.ts
      auth.ts
      contact.ts

    utils/
      formatCurrency.ts
      formatDate.ts
      slugify.ts
      cn.ts

  types/
    database.ts
    property.ts
    agent.ts
    inquiry.ts
    user.ts

  config/
    site.ts
    navigation.ts
    constants.ts

  styles/
    globals.css
    tokens.css

public/
  icons/
  logos/
  placeholders/

supabase/
  migrations/
  seed.sql

docs/
  architecture.md
  database.md
  deployment.md
  environment.md
  security.md

.env.example
.env.local
.gitignore
README.md
package.json
tsconfig.json
next.config.ts
```

Adapt this structure to the selected framework if necessary, but preserve the separation of concerns.

==================================================
31. IMPORTANT: NO MONOLITHIC FILES
==================================

Do NOT create:

* 1000+ line page components
* One giant CSS file containing everything
* One giant database service
* One giant API file
* One giant admin component
* Duplicate property card implementations
* Duplicate headers
* Duplicate footers

Pages should compose reusable components.

==================================================
32. DATA ACCESS LAYER
=====================

Do not write Supabase queries randomly throughout UI components.

Use:

lib/services/

Examples:

properties.ts
agents.ts
favorites.ts
inquiries.ts

Components should consume service functions.

Example conceptual flow:

UI
↓
Service
↓
Supabase
↓
Database

==================================================
33. TYPESCRIPT
==============

Use TypeScript strictly.

Avoid:

any

unless absolutely necessary.

Create reusable types/interfaces.

Generate/maintain database types from Supabase where practical.

==================================================
34. PROPERTY CARD
=================

PropertyCard is one of the most important reusable components.

It must reproduce the screenshot exactly.

Include:

* image area
* status badge
* featured badge
* price
* title
* location
* BHK
* area
* tenant type
* subtle border
* rounded corners
* dark purple surface
* correct hover effect

The same component should be used everywhere:

Home
Rentals
Property details recommendations

Do not create separate visually inconsistent property cards.

==================================================
35. AGENT CARD
==============

AgentCard must reproduce the Agents reference page.

Include:

* avatar
* name
* designation
* description
* stats
* action icons/buttons

Use same spacing and visual treatment.

==================================================
36. RESPONSIVE DESIGN
=====================

The screenshots primarily show desktop layouts.

Reproduce desktop design accurately first.

Then make it responsive.

Breakpoints:

* Desktop
* Tablet
* Mobile

Mobile must NOT become a completely different website.

Maintain:

* Same visual identity
* Same cards
* Same colors
* Same typography hierarchy
* Same section order

Adapt only:

* columns
* spacing
* navigation
* image sizes
* typography scaling
* stacking

==================================================
37. ANIMATIONS
==============

Use subtle animations only where they improve the existing experience.

Examples:

* hover
* card lift
* button interaction
* fade-in
* subtle page transitions

DO NOT add:

* excessive parallax
* flashy animations
* 3D effects
* unnecessary moving backgrounds
* distracting particle effects

The original website is clean and professional.

==================================================
38. ICONS
=========

Use a consistent icon library such as Lucide if the project already uses it.

Do not mix random icon styles.

Icons should match the visual weight shown in screenshots.

==================================================
39. IMAGES
==========

The reference screenshots currently contain placeholder/gradient-like property imagery.

Do not randomly insert unrelated stock photography that changes the appearance.

Create the same visual placeholders/gradient treatment if real images are not available.

Architecture must support real property images through Supabase Storage later.

==================================================
40. CONTENT
===========

Where text is visible in the reference screenshots, preserve it as closely as possible.

Do not randomly rewrite:

* headings
* section titles
* CTA labels
* navigation
* property titles
* agent names
* neighborhood names
* descriptions

If some content is not clearly readable from the screenshot, use sensible structured placeholder content but keep the same approximate length and hierarchy.

Do not create completely different marketing copy.

==================================================
41. NO PROPERTY OWNER MARKETPLACE
=================================

CRITICAL BUSINESS RULE:

There is NO property-owner portal.

There is NO:

* landlord registration
* owner dashboard
* owner property upload
* owner listing creation
* owner listing management
* owner subscription

All properties are controlled by:

PrimeHomeKanpur ADMIN

Therefore:

ADMIN
↓
Creates property
↓
Uploads images
↓
Publishes property
↓
Tenant views property

==================================================
42. SEARCH
==========

Rental search must actually work.

Filters:

* Location
* BHK
* Price range
* Tenant type
* Property type if supported

Filtering must query Supabase/database data.

Do not implement fake filtering that only changes UI.

==================================================
43. PROPERTY DETAIL ROUTING
===========================

Each property must have:

slug

Example:

/rentals/modern-2bhk-with-balcony

Do not use random UI-only IDs in URLs if slug architecture is available.

==================================================
44. SEO
=======

Implement:

* Page title
* Meta description
* Open Graph metadata
* Canonical URLs where appropriate
* Dynamic property metadata
* Proper heading hierarchy
* Semantic HTML
* Image alt text
* robots configuration
* sitemap
* structured metadata where appropriate

SEO implementation must not alter the visual design.

==================================================
45. ACCESSIBILITY
=================

Implement:

* keyboard navigation
* focus states
* semantic buttons
* accessible labels
* form labels
* alt text
* sufficient contrast
* ARIA only where needed

Do not sacrifice visual similarity.

==================================================
46. ERROR / LOADING STATES
==========================

Every database-dependent area should have:

Loading state
Empty state
Error state

Examples:

No properties found
No favorites
No inquiries
No agents
Failed to load properties

Use the same visual design language.

==================================================
47. FORMS
=========

Use proper validation.

Recommended:

React Hook Form
+
Zod

if compatible with the project.

Validate:

* Email
* Phone
* Required fields
* Price
* Dates
* Messages

Show useful error messages.

==================================================
48. ENVIRONMENT VARIABLES
=========================

Create:

.env.example

Example:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

If server-only secret is genuinely required:

SUPABASE_SERVICE_ROLE_KEY=

But NEVER expose it client-side.

Local:

.env.local

must be ignored by Git.

==================================================
49. GIT / GITHUB
================

Prepare the project for GitHub.

.gitignore must include:

.env
.env.local
.env.*.local
node_modules
.next
dist
build
coverage
logs
OS-specific files

Create:

README.md

Include:

* Project overview
* Tech stack
* Folder structure
* Installation
* Environment variables
* Local development
* Supabase setup
* Database migrations
* Storage setup
* Authentication
* Deployment
* Admin setup
* Troubleshooting

==================================================
50. DOCUMENTATION
=================

Create:

docs/
architecture.md
database.md
security.md
environment.md
deployment.md

architecture.md:
Explain frontend architecture.

database.md:
Explain tables and relationships.

security.md:
Explain authentication, authorization and RLS.

environment.md:
Explain environment variables.

deployment.md:
Explain production deployment.

==================================================
51. HOSTINGER DEPLOYMENT READINESS
==================================

Prepare the project for Hostinger deployment.

Do not hardcode localhost URLs.

Use environment variables.

Make sure production build works.

Commands should work:

npm install

npm run dev

npm run build

npm start

If the selected Hostinger plan uses a specific Next.js deployment approach, keep the project compatible with that deployment model.

Do not add deployment hacks that damage local development.

==================================================
52. PERFORMANCE
===============

Optimize:

* Images
* Fonts
* Database queries
* Components
* Client-side JavaScript
* Lazy loading
* Server rendering where appropriate

Avoid unnecessary client components.

Use server components by default where supported.

Use client components only when interactivity requires them.

==================================================
53. SECURITY CHECKLIST
======================

Implement:

* Supabase RLS
* Server-side authorization
* Input validation
* Secure auth
* Secure cookies/session handling
* No secret exposure
* No service-role key in browser
* No SQL injection through unsafe raw SQL
* Proper file upload validation
* File type validation
* File size limits
* Secure admin routes
* Error messages that do not expose sensitive data

==================================================
54. CODE QUALITY
================

Code must be:

* Clean
* Modular
* Reusable
* Typed
* Maintainable
* Easy to navigate
* Production-ready

Use meaningful names.

Avoid:

* random filenames
* duplicate components
* dead code
* unused dependencies
* unnecessary abstractions
* inline massive styles
* repeated database queries
* hardcoded secrets

==================================================
55. IMPORTANT FILE ORGANIZATION RULE
====================================

Every file must have a clear responsibility.

Examples:

Header.tsx
→ only header/navigation

Footer.tsx
→ only footer

PropertyCard.tsx
→ only reusable property card

properties.ts
→ property data access

property.ts
→ property validation/types

client.ts
→ browser Supabase client

server.ts
→ server Supabase client

admin.ts
→ server-only admin client if required

Do not mix unrelated responsibilities.

==================================================
56. DO NOT CREATE UNNECESSARY FILES
===================================

Before creating a file, determine whether an existing file already handles the responsibility.

Do not create:

button2.tsx
propertyCardNew.tsx
newHeader.tsx
finalHeader.tsx
testHeader.tsx

etc.

If something needs modification, update the correct existing component.

==================================================
57. REMOVE DEAD / UNNECESSARY CODE
==================================

If rebuilding from an old source tree:

Remove:

* unused components
* duplicate components
* unused pages
* dead CSS
* unused dependencies
* obsolete API code
* old mock data that is no longer required
* temporary test files
* generated junk
* duplicate assets

But DO NOT remove anything required by the final architecture.

==================================================
58. MOCK DATA
=============

During development, mock/seed data may be used.

However:

UI components must NOT depend permanently on hardcoded mock arrays.

Use:

Supabase
+
seed.sql

for initial data.

==================================================
59. SEED DATA
=============

Create useful development seed data for:

* properties
* agents
* locations
* FAQs
* testimonials

Seed data should visually reproduce the reference screenshots.

==================================================
60. PUBLIC VS ADMIN ARCHITECTURE
================================

Public:

/
/about
/rentals
/rentals/[slug]
/agents
/services
/faq
/contact

Authenticated:

/profile
/favorites
/my-inquiries

Admin:

/admin
/admin/properties
/admin/agents
/admin/inquiries
/admin/users
/admin/faqs
/admin/testimonials

Protect admin routes.

==================================================
61. IMPORTANT VISUAL RULE
=========================

The reference screenshots have priority over generic design conventions.

If your normal design preference conflicts with the screenshot:

FOLLOW THE SCREENSHOT.

Do not "improve" the screenshot.

Do not redesign.

Do not change:

* section order
* card shapes
* colors
* navigation
* spacing
* typography hierarchy
* CTA placement
* overall composition

unless technically necessary.

==================================================
62. EXACT VISUAL RECREATION PROCESS
===================================

Before implementing each page:

1. Analyze the corresponding reference screenshot.
2. Identify:

   * page width
   * container width
   * section spacing
   * grid columns
   * card dimensions
   * colors
   * typography
   * borders
   * gradients
   * buttons
   * badges
   * icons
   * footer
3. Build the page.
4. Compare the result against the reference.
5. Correct visual differences.
6. Only then move to the next page.

Do NOT build all pages quickly using generic reusable sections and assume they are visually equivalent.

Reuse components for code quality, but preserve page-specific composition.

==================================================
63. NO DESIGN DRIFT
===================

The following pages must feel like ONE website:

Home
About
Rentals
Property Details
Agents
Services
FAQ
Contact

Do not allow each page to develop a different visual style.

==================================================
64. FINAL QUALITY REQUIREMENT
=============================

The final result should feel like:

"PrimeHomeKanpur old website rebuilt from scratch using a clean production architecture."

NOT:

"A completely new website inspired by the old website."

==================================================
65. DEVELOPMENT PHASES
======================

Implement in this order:

PHASE 1:
Project architecture

PHASE 2:
Global design system

PHASE 3:
Header + Footer

PHASE 4:
Home page

PHASE 5:
Rentals page

PHASE 6:
Property details

PHASE 7:
Agents

PHASE 8:
About

PHASE 9:
Services

PHASE 10:
FAQ

PHASE 11:
Contact

PHASE 12:
Authentication

PHASE 13:
Supabase integration

PHASE 14:
Admin dashboard

PHASE 15:
RLS/security

PHASE 16:
Storage/image management

PHASE 17:
Validation/loading/error states

PHASE 18:
SEO/accessibility

PHASE 19:
Responsive optimization

PHASE 20:
Production build testing

==================================================
66. ACCEPTANCE CRITERIA
=======================

The project is NOT complete until:

[ ] Home visually matches reference
[ ] About visually matches reference
[ ] Rentals visually matches reference
[ ] Property Details visually matches reference
[ ] Agents visually matches reference
[ ] Services follows same exact design system
[ ] FAQ follows same exact design system
[ ] Contact follows same exact design system
[ ] Header is reusable
[ ] Footer is reusable
[ ] PropertyCard is reusable
[ ] AgentCard is reusable
[ ] All public pages are responsive
[ ] Search works
[ ] Filters work
[ ] Property detail routing works
[ ] Authentication works
[ ] Favorites work
[ ] Inquiry form works
[ ] Contact form works
[ ] Admin authentication works
[ ] Admin property CRUD works
[ ] Admin agent CRUD works
[ ] Admin inquiry management works
[ ] FAQ management works
[ ] Testimonial management works
[ ] Supabase database works
[ ] Supabase Storage works
[ ] RLS is enabled
[ ] RLS policies are tested
[ ] Secrets are protected
[ ] .env.local is ignored
[ ] .env.example exists
[ ] Database migrations exist
[ ] Seed data exists
[ ] README exists
[ ] Architecture documentation exists
[ ] Security documentation exists
[ ] Deployment documentation exists
[ ] No unnecessary duplicate files
[ ] No dead code
[ ] No broken routes
[ ] No console errors
[ ] npm run build succeeds
[ ] Production build is deployment-ready

==================================================
67. FINAL INSTRUCTION
=====================

DO NOT start by creating a completely different design.

FIRST recreate the visual system shown in the attached reference screenshots.

SECOND create the reusable component architecture.

THIRD connect the dynamic functionality.

FOURTH connect Supabase.

FIFTH create the admin functionality.

SIXTH perform a complete visual and functional QA pass.

The attached screenshots are the PRIMARY visual reference.

Preserve the existing PrimeHomeKanpur identity.

The final website must look as close as technically possible to the old website shown in the screenshots while having a much cleaner, more structured, maintainable, scalable and production-ready source code.

Do not make unnecessary design decisions on your own.

When a design detail is visible in the reference screenshot, reproduce it.

When a technical implementation detail is not visible, choose the cleanest production-grade implementation that preserves the exact visible result.

```
```
