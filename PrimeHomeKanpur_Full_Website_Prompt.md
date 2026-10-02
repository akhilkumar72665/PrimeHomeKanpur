# PrimeHomeKanpur — Full Website Rebuild Prompt

You are a senior UI engineer + full-stack developer. Rebuild the website **PrimeHomeKanpur** (rental-only real-estate platform, Kanpur, Uttar Pradesh, India).

The 8 attached screenshots are the OLD website. They are the **single source of truth** for look, layout, section order and copy. This is a REBUILD, not a redesign:

- Same dark + purple + cyan visual identity, same section order, same card shapes, same copy.
- Do NOT restyle it like Housing.com / Zillow / Airbnb / generic SaaS templates.
- Do NOT add new colors, new sections, new fonts, or "improvements".
- Where the screenshot shows a visible detail, reproduce it. Where it doesn't, pick the cleanest production-grade implementation that keeps the visible result identical.
- Exception: fix the known bugs listed in section 12.

---

## 1. TECH STACK

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Storage) via `@supabase/supabase-js` and `@supabase/ssr`
- Zod + React Hook Form for forms
- lucide-react icons, Inter font via `next/font`
- Deployable on Hostinger (Node-compatible) / Vercel

Architecture rules:
- Reusable components, small files, one responsibility per file. No monolithic pages, no duplicate components (`newHeader.tsx`, `final2.tsx` etc. are forbidden).
- Data access lives in `src/lib/data/*.ts` (properties.ts, agents.ts, areas.ts, faqs.ts, testimonials.ts, inquiries.ts). UI components never call Supabase directly and never use permanent hardcoded arrays.
- Secrets only in `.env.local` (gitignored) + `.env.example`.

Suggested structure:
```
src/
  app/ (public routes, (auth), admin/)
  components/
    layout/ Header, Footer, MobileMenu
    sections/ PageHero, HomeHero, StatsStrip, CtaBanner, SectionHeading, ...
    cards/ PropertyCard, AgentCard, AreaCard, TestimonialCard, ServiceCard, ValueCard, StepCard, FaqItem
    forms/ SearchBar, ScheduleVisitForm, ContactForm, NewsletterForm
    ui/ Button, Badge, Pill, Input, Select
  lib/ data/, supabase/ (client.ts, server.ts, admin.ts), validations/
  styles/ tokens.css, globals.css
supabase/ migrations/, seed.sql
```

---

## 2. DESIGN TOKENS (tune to match screenshots)

Create `tokens.css` + Tailwind theme extension. Never hardcode random hex values in components.

| Token | Approx value | Usage |
|---|---|---|
| `--bg` | `#07050F` (near-black, slight violet) | page background |
| `--bg-purple` | `#140B36 → #1A0F42` | alternate sections (stats strip, "How it works", footer area, CTA bands) |
| `--surface` | `#0E0A20` | cards |
| `--surface-elevated` | `#150F30` | footer card, hero cards, CTA card |
| `--border` | `rgba(139,92,246,0.18)` | 1px card borders |
| `--primary` | `#00C2D9` (cyan/turquoise) | CTAs, active nav pill, highlighted heading words, stat numbers, prices/links |
| `--primary-hover` | `#22D3EE` | hover |
| `--violet` | `#7C3AED` / `#6D28D9` | gradients, secondary buttons (dark purple fill `#2A1566` with border) |
| `--accent-pink` | `#EC4899` | phone icons only |
| `--badge-rent-bg` / `--badge-rent-text` | `#FFE4E6` / `#E11D48` | "For Rent" badge |
| `--danger-badge` | `#EF4444` | "Most requested" / "Best Value" corner badge |
| `--text` | `#FFFFFF` | headings |
| `--text-secondary` | `#B8B2D6` (lavender grey) | body |
| `--text-muted` | `#8A84A8` | meta, labels |
| Radius | cards 16px, inputs 10–12px, buttons/pills 999px, icon squares 10px |
| Shadows | soft dark; featured card has a purple glow (`0 20px 60px rgba(124,58,237,.25)`) |

Property-card / area-card image gradients (no real photos yet; each card has a different 135° gradient with a faint grid overlay):
teal `#0F766E→#00C2D9`, red `#7F1D1D→#EF4444`, charcoal `#1F2937→#6B7280`, cyan `#0891B2→#22D3EE`, coral `#9F3A3A→#F87171`, dark-teal `#134E4A→#2DD4BF`, violet `#4C1D95→#7C3AED`, light-violet `#5B21B6→#8B5CF6`, magenta `#831843→#EC4899`, blue `#1E3A8A→#3B82F6`, green `#166534→#22C55E`, gold `#92400E→#EAB308`.
The architecture must allow swapping these for real Supabase Storage images later (fallback to gradient when `image_url` is null).

**Typography (Inter):** Hero H1 56–64px / 800 (home) and 48–56px / 800 (inner pages); section H2 40px / 700; card title 18–20px / 700; body 15–16px; meta 12–13px; eyebrow pill text 12px / 600; buttons 14px / 600. Keep the same scale on every page.

**Signature heading pattern:** every H1/H2 is white with ONE highlighted phrase in cyan (e.g. "Find your perfect **rental home** in Kanpur"). Build a `<Highlight>` helper / `SectionHeading` prop for it.

**Eyebrow pill:** small rounded-full pill (dark purple fill, 1px border) with a tiny cyan icon-square on the left + 12px label, placed above every section heading and in every hero.

**Backgrounds:** body is `--bg`; sections alternate between `--bg` and `--bg-purple` (soft vertical gradient). Inner-page heroes: dark with a radial purple glow at top-left (and a teal glow top-right on Rentals/Property hero) plus a subtle diagonal-line pattern (~-20°, 1px lines, ~6% opacity).

---

## 3. GLOBAL COMPONENTS

### Header (one component, all pages)
- Sticky/dark bar, bottom border subtle. Left: logo = rounded-square gradient icon (blue `#3B82F6` → violet `#8B5CF6`) + "PrimeHomeKanpur" bold white.
- Center nav: Home · About · Rentals · Agents · Services · FAQ · Contact. **Active item = solid cyan pill with dark text.**
- Right CTA (dark-purple pill, border, pill radius). Text changes per page via prop:

| Page | CTA text |
|---|---|
| Home | Explore Rentals |
| About | Contact Us |
| Rentals | List Property |
| Property Details | Schedule Tour (Rentals stays active in nav) |
| Agents | Talk to Agent |
| Services | Get Service |
| FAQ | Ask a Question |
| Contact | Call Now (pink phone icon) |

- Mobile: hamburger → slide-down drawer with same links + CTA.

### Footer (one component, all pages)
1. Large rounded card (`--surface-elevated`, purple gradient tint, border) containing 3 columns:
   - Left: logo + "Experience rental search designed for clarity, featuring modern tools and a team that actually answers." + 6 social icon buttons in rounded squares (Facebook, Instagram, X, LinkedIn, WhatsApp, YouTube).
   - Middle: `ADDRESS` (tiny uppercase cyan label) → pin icon + "Awadhpuri, Near Sales Tax Office, Kanpur – 208024".
   - Right: `CONTACT` → mail icon `pathak424448@gmail.com`, phone icon `+91 6398987290`.
2. Below the card, 4 columns:
   - `SUBSCRIBE TO OUR NEWSLETTER` — "Get the latest rental listings and market updates delivered straight to your inbox." + email input joined to cyan "Submit" button.
   - `NAVIGATION` — Home, About, Rentals, Agents, Services, Contact
   - `COMPANY` — About Us, Our Team, FAQs, Support
   - `LEGAL` — Privacy Policy, Terms & Conditions, Cookie Policy
3. Bottom row (top border): "© 2026 PrimeHomeKanpur. All rights reserved." left; "Terms of Use" and "Privacy Policy" right.

### Reusable pieces
- **PageHero** (pill, H1 with cyan phrase, description max-width ~560px, breadcrumb "Home / Page" with cyan "Home").
- **CtaBanner**: centered rounded card (`--surface-elevated`, border, purple tint) — H2 with cyan phrase, 1–2 line description, two buttons (cyan solid + dark-purple secondary).
- **Button variants**: `primary` (cyan fill, dark text), `secondary` (dark purple fill + border, white text), `outline` (transparent, 1px border, white text). All pill-shaped.
- **PropertyCard**: 4:3 gradient image area with top-left "For Rent" badge (pale pink bg, red text) and optional top-right badge ("Featured" / "Premium", cyan fill). Body: price large white bold `₹18,000` + small muted `/month`; title bold + location (pink pin icon + "Gurudev Chauraha, Kanpur") side by side; divider; footer row: `2 BHK` · `1,050 sqft` (left, muted) and tenant-type tag (right, small bold lavender pill: Family / Bachelor / Pro / Family / Pro / Bachelor / Bachelor / Professional). Entire card links to `/rentals/[slug]`.
- **AgentCard**, **AreaCard**, **TestimonialCard**, **ServiceCard**, **StepCard** — see page specs.

---

## 4. HOME PAGE `/`

1. **Hero** (left-aligned, full-width dark with violet glow):
   - Avatar stack of 3 gradient circles with initials (JM, AR, KP …) + 5 red/pink stars + "Trusted by 40+ clients".
   - H1 (3 lines, left half of screen): "Find your next rental with PrimeHomeKanpur".
   - Text: "Find your perfect rental with ease. Explore verified listings, get landlord-ready support, and move in with confidence."
   - Cyan button "Explore Rentals →".
   - **Search bar card** (full width, rounded, border): 4 labelled selects — Location (All Kanpur areas), BHK (Any BHK), Price range (Any budget), Tenant type (Any tenant type) + cyan button with search icon "Search Rentals". Submits to `/rentals?location=&bhk=&price=&tenant=`.
2. **Stats strip** (purple band, 4 cells with vertical dividers, big cyan number + muted label): `83` Total Reviews · `14` Years of Experience · `67` Rentals Listed · `98%` Satisfaction Rate. (Pull from DB/settings; animate count-up.)
3. **Rental Listings**: pill "Rental Listings"; H2 "Explore Premium **Rentals** Chosen For You"; right-aligned cyan button "View All Rentals →"; muted line "Showing 6 rentals across Kanpur". 4-column grid, 6 cards (4 + 2), in this order: Spacious 2BHK Apartment, Cozy Studio Flat, Luxurious 3BHK Duplex, Modern 2BHK with Balcony (Featured badge), Budget Friendly 1BHK, Premium 3BHK Villa. (Data in section 9.)
4. **Popular Areas**: pill "Popular Areas"; H2 "Our Rental Expertise Across Diverse **Working Areas**"; button "View All Locations →". One row of 5 AreaCards (Gurudev Chauraha, Kakadeo, Vijay Nagar, Vikas Nagar, Awas Vikas) — gradient tiles (teal / purple / red / teal / purple), name bold white bottom-left, "Kanpur" small below. Implemented as an infinite marquee with edge fade mask; pause on hover.
5. **Testimonials**: centered pill "Testimonials"; H2 "Clients **Success** Stories"; sub "Our clients' success stories highlight achievements, satisfaction, and results, reflecting our expertise, dedication, and trusted partnerships."
   - Large centered featured card (dark, rounded) with small purple avatar circles (JM, KP, SL, AR, OT, NB) floating around it at fixed positions; clicking an avatar swaps the featured quote. Featured: "PrimeHomeKanpur made the entire rental-search process surprisingly easy. The interface is smooth, the details are clear, and I actually enjoyed comparing different places." ★★★★★ **Jyoti Mishra** — Tenant · Kakadeo.
   - Below: 3 compact cards (quote, avatar initials, name, role): Ankit Rao · Working Professional — "Found my 2BHK in Vikas Nagar within a week. The agent was responsive and the paperwork was handled professionally." / Kavita Pathak · Property Owner — "As a landlord, they screened tenants thoroughly and my property was vacant for only 10 days. Highly recommended." / Shubham Lal · Bachelor · Swaroop Nagar — "The verified listings saved me a lot of time. Photos matched reality exactly and the rent was fair."
6. **Why choose us** (purple band): pill "Why Choose Us"; centered H2 "Why choose our rental expertise". Left: visual = purple gradient rounded rectangle with an offset teal-gradient rounded rectangle on top (thick dark border, like a device frame). Right: 4 rows, each with a cyan icon-square + bold title + muted text, separated by thin dividers:
   - Expert Guidance — "Find rentals by filtering for application competition and recent rent updates to make informed decisions easily."
   - Verified Rental Selection — "Every listing is checked in person before it reaches our catalog, so photos always match reality."
   - Stress-Free Process — "We track applications, deposits, and lease deadlines so you're never chasing a document."
   - Proven Track Record — "Over a decade of leases signed across 43 neighborhoods and counting."
7. **Our Services**: pill "Our Services"; H2 "We offer a complete spectrum of rental services for your needs"; sub "We currently focus only on rentals — helping landlords rent hassle free, backed by unparalleled results and expertise." 3 ServiceCards (Find a rental / List your rental [red "Most requested" corner badge, cyan "Read more" button] / Renewals & appraisal), each with icon square, title, 1-line description, 3 cyan-checked bullets, full-width "Read more" button (outline; cyan on the featured one). Bullets — Find a rental: Neighborhood matching · Move-in date filtering · Verified listings only. List your rental: Free professional photos · Tenant screening · Lease drafting. Renewals & appraisal: Market rent appraisal · Lease renewal support · Deposit handling.
8. **CTA**: "Ready to find your **dream rental?**" / "Join hundreds of happy tenants and landlords who trust PrimeHomeKanpur for all their rental needs in Kanpur." / [Browse Rentals] [List Your Property].
9. Footer.

---

## 5. ABOUT PAGE `/about`

1. PageHero — pill "About Us"; H1 "Connecting Kanpur families & professionals with **their perfect home**"; text "Since 2012, PrimeHomeKanpur has been Kanpur's most trusted rental marketplace. With deep local knowledge and a client-first approach, we make renting simple, transparent, and stress-free."; breadcrumb Home / About Us.
2. **Story** (2 columns): left = tall purple gradient rounded block with diagonal-line pattern (image slot); right = pill "Our Story", H2 "Building Kanpur's most trusted **rental platform**", 3 paragraphs:
   - "PrimeHomeKanpur started as a small family-run real estate consultancy in Awadhpuri in 2012. Back then, most rental transactions happened through word of mouth and shady brokers — tenants were often scammed, and landlords struggled to find reliable occupants."
   - "We set out to change that by focusing on three simple rules: verify every listing in person, be transparent about fees, and stay with the client until the keys are handed over. Fourteen years later, those same rules guide everything we do."
   - "Today, we've helped over 500 families and professionals find homes across 43 Kanpur neighborhoods — from the tree-lined streets of Civil Lines to the vibrant markets of Kakadeo."
3. **Stats band** (purple, 4 cells, vertical dividers): `14+` Years of Experience · `500+` Families Helped · `67+` Active Listings · `98%` Satisfaction Rate (count-up animation; numbers in cyan).
4. **Mission & Values**: pill; H2 "What drives us every **single day**"; 4 centered cards with emoji/icon square: Our Mission — "To make renting in Kanpur fair, transparent, and hassle-free — for both tenants and landlords." · Our Vision — "To become Kanpur's #1 rental marketplace by 2028, powered by technology and trusted relationships." · Integrity First — "Honest advice, no hidden fees, and listings that always match reality. That's our promise to you." · Client First — "We don't close deals — we build relationships. 60% of our clients come from referrals."
5. **Leadership**: pill; H2 "Meet the people behind **PrimeHomeKanpur**"; 4 cards (gradient initials avatar, name, cyan role, bio): Rajesh Pathak — Founder & CEO — "14+ years in Kanpur real estate. Ex-banker turned entrepreneur with a passion for making renting fair." · Shikha Pathak — Co-Founder · Operations — "Leads tenant verification, lease management, and the 7-member client support team." · Amit Kumar — Head of Listings — "Verifies every property in person before it goes live — maintains our quality benchmark." · Neha Mishra — Senior Agent · West Kanpur — "Expert in Vikas Nagar, Kakadeo, and Vijay Nagar markets. 180+ deals closed." Centered cyan button "Meet Our Full Team →" (links to /agents).
6. **Why choose us** (purple band, 2 cols): left pill "Why Choose Us", H2 "Not just brokers — your **rental partners for life**", 5 cyan-check items:
   - Every listing physically verified before going live — no fake photos, no ghost properties.
   - Transparent 1-month brokerage for tenants. Landlords list free for the first 60 days.
   - End-to-end support: shortlisting, visits, verification, lease drafting, and move-in.
   - Deep local expertise across 43 Kanpur neighborhoods — we know which societies have 24×7 water and which don't.
   - 98% of our clients would recommend us to a friend. That's the trust we've built since 2012.
   Buttons: [Browse Our Listings] (cyan) [Talk to Founder] (secondary). Right: large teal-gradient rounded image block.
7. **Client Love**: pill; H2 "What our **clients say** about us"; 3 testimonial cards (quote, initials avatar, name, role):
   - Vinod Gupta (VG) · Family · Vijay Nagar — "Rajesh ji helped us find a 3BHK in Vijay Nagar within 5 days. We're a family of 5 with specific needs — he patiently showed us 8 properties and negotiated the rent down by ₹4,000. Truly professional service!"
   - Rohan Singh (RS) · Software Engineer · Kakadeo — "As a bachelor moving to Kanpur from Delhi, I was worried about getting scammed. PrimeHomeKanpur's verified listings gave me confidence. I signed my Kakadeo flat within 48 hours and everything matched the photos exactly."
   - Meeta Trivedi (MT) · Property Owner · 4 Properties — "I own 4 properties in Awadhpuri and Swaroop Nagar. Earlier I was managing everything myself — bad tenants, delayed rent, constant calls. Since handing everything to PrimeHomeKanpur 3 years ago, I haven't had a single vacancy for more than 2 weeks. Worth every rupee."
8. CTA: "Ready to start your **rental journey?**" / "Whether you're looking for a home or need help renting out your property, our team is ready to help you every step of the way." / [Browse Rentals] [Get in Touch].

---

## 6. RENTALS PAGE `/rentals`

1. PageHero (violet + teal glow) — pill "Rental Listings"; H1 "Find your perfect **rental home** in Kanpur"; text "Browse 67+ verified listings across prime locations. Filter by budget, BHK, tenant type, and more to find exactly what you need."; breadcrumb Home / Rentals.
2. **Filter bar** — rounded card overlapping the hero bottom: Location · BHK · Price range · Tenant type (labels above, dark selects with chevron) + cyan "Search" button with icon. Filters are real, query Supabase, and sync to the URL query string.
3. Heading row: H2 "All **Rental** Properties", muted "Showing 12 rentals across Kanpur" (dynamic "Showing X of Y"). Right side: dark button "Shortlist" (heart/chat icon, opens favorites) and cyan button "Get Assistance" (pink phone icon → /contact).
4. **Grid**: 4 columns × 3 rows of PropertyCards, order:
   Row 1 — Spacious 2BHK Apartment · Cozy Studio Flat · Luxurious 3BHK Duplex (**Featured**) · Modern 2BHK with Balcony
   Row 2 — Budget Friendly 1BHK · Premium 3BHK Villa · Newly Built 2BHK Flat · Near Metro 1BHK
   Row 3 — Heritage 3BHK Apartment (**Premium**) · Park Facing 2BHK · Compact 1BHK Flat · 3BHK with Terrace Garden
5. **How It Works** (purple band): pill; H2 "Find your rental in **4 simple steps**"; sub "Our streamlined process gets you from browsing to move-in faster than you thought possible." 4 StepCards (cyan numbered square 1–4): Browse Listings — "Filter and explore our verified listings across 16+ Kanpur neighborhoods." · Schedule Visit — "Book a visit online or call our agent to see the property in person." · Apply & Verify — "Submit documents and complete tenant verification with our guidance." · Move In — "Sign the lease, pay deposit, and get your keys. Welcome home!"
6. CTA: "Need help **finding the perfect place?**" / "Our rental experts know every corner of Kanpur. Tell us your requirements and we'll shortlist the best matches for you — free of charge." / [Talk to an Expert] [Meet Our Agents].

---

## 7. PROPERTY DETAILS `/rentals/[slug]` (reference: "Modern 2BHK with Balcony")

1. Hero — pill "Property Details"; H1 = property title; pink pin + "Vikas Nagar, Kanpur · Available for rent"; breadcrumb Home / Rentals / {title}.
2. **Gallery**: large rounded container (border) with a big main image (gradient fallback) and a row of 4 thumbnails below (teal, red, gray, cyan); clicking a thumbnail swaps the main image.
3. **Two-column layout** (left ~65%, right ~35% sticky sidebar).

**Left column cards (in order):**
- **Price card**: `₹14,000` large white + `/ month` muted; "For Rent" badge + "Listed 3 days ago"; meta line: **Deposit:** ₹28,000 · **Maintenance:** ₹1,200/mo · **Available:** Immediate · **Furnishing:** Semi-Furnished.
- **Quick Facts**: 4 tiles — `2` Bedrooms · `2` Bathrooms · `980` Sqft Area · `3` Floor (of 6) (cyan numbers).
- **Amenities**: 3-column grid, each = small icon square + label: Parking Available, Power Backup, 24×7 Water, Elevator, High-Speed WiFi, Balcony / Garden, Senior Friendly, Gated Society, Washing Machine, Modular Kitchen, AC in Bedrooms, DTH Connection.
- **Property Description** (4 paragraphs):
  1. "This beautifully designed 2BHK apartment in the heart of Vikas Nagar offers modern living at an affordable price. The apartment is on the 3rd floor of a well-maintained 6-story building with elevator access, power backup, and 24-hour water supply."
  2. "The spacious living room opens to a private balcony overlooking a green park — perfect for morning tea or evening relaxation. Both bedrooms come with built-in wardrobes and AC points. The modular kitchen is equipped with a chimney, cabinets, and has a separate utility area with washing machine hookups."
  3. "Located just 5 minutes from the main Vikas Nagar market, schools, hospitals, and public transport are all within walking distance. The gated society offers reserved covered parking, CCTV surveillance, and a children's play area."
  4. "Preferred tenants: Working professionals, small families, or couples. Non-negotiable: No smoking inside, no pets, 11-month lease agreement with 2 months security deposit."
- **Location Advantages** (icon + bold label + text): Nearby Schools: Delhi Public School (1.2 km), St. Xavier's (2.0 km), UP Public School (800m) · Hospitals: Regency Hospital (1.8 km), Apollo Clinic (1.1 km), Metro Hospital (2.5 km) · Shopping: Vikas Nagar Market (500m), Rave@Moti Mall (3.2 km), Z Square Mall (5.0 km) · Transport: Vikas Nagar Bus Stand (400m), Kanpur Central Railway Station (9 km), IIT Kanpur (7 km).
- **Map Location**: card with grid pattern, cyan pin, "Vikas Nagar, Kanpur", coordinates "26.3131° N, 80.2785° E". (Use lat/lng columns; allow swapping to a real map embed later.)

**Right sidebar (sticky):**
- **Agent card**: gradient avatar "RP", **Rajesh Pathak**, "Senior Rental Agent · 12 yrs exp" (use agent's real years from DB), stats row `240+` Deals Closed · `4.9★` Client Rating · `45` Active Listings; buttons stacked: [Call Agent] cyan, [Email Agent] purple, [WhatsApp] outline.
- **Schedule a Site Visit** card: "Fill the form and we'll confirm your visit within 2 hours." Fields: Your Full Name (placeholder John Doe), Phone Number (+91 98765 43210), Preferred Date (date picker), Preferred Time (select time slot), cyan full-width [Schedule Tour]. Saves to `property_inquiries` with the property id.
- **Tenant Tips** card (💡 cyan title): "Before scheduling a visit, here's what you should know:" ✓ Carry 2 government ID proofs ✓ Deposit is 2 months' rent (refundable) ✓ Minimum 11-month lease agreement ✓ Brokerage: 1 month rent (one-time).

4. **Similar Rentals** (purple band): pill "Similar Rentals"; H2 "You might also **like these**" + right button "View All →"; 4 PropertyCards (Spacious 2BHK Apartment ₹18,000 · Premium 3BHK Villa ₹24,000 · Park Facing 2BHK ₹15,500 · Newly Built 2BHK Flat ₹12,500) — in production, pick by same area / similar price, excluding the current property.

---

## 8. AGENTS PAGE `/agents`

1. PageHero — pill "Meet Our Agents"; H1 "Kanpur's most trusted **rental experts**, here for you"; text "Every agent at PrimeHomeKanpur lives and breathes Kanpur real estate. Pick your preferred neighborhood and get matched with a local expert who knows the area inside out."; breadcrumb Home / Our Agents.
2. Centered H2 "The people who'll help you find **your next home**"; muted "Average 8+ years experience each · 500+ cumulative deals closed · 4.9★ client rating".
3. **Agent grid** 3 × 2. AgentCard = rounded dark card: 80px gradient circle avatar with initials, name (bold), role (cyan, small), bio (muted, 3–4 lines), divider, 3 stats (cyan value + muted label), divider, 3 small icon buttons (phone [pink icon], mail, chat) in rounded dark squares.
   | Name | Role | Bio | Deals | Rating | Yrs |
   |---|---|---|---|---|---|
   | Rajesh Pathak (RP, blue→cyan) | Founder · Senior Agent | 14+ years in Kanpur rentals. Specialises in premium 3BHK+ properties and luxury apartments across Civil Lines, Swaroop Nagar and Vijay Nagar. | 240+ | 4.9★ | 12 |
   | Shikha Pathak (SP, orange→red) | Co-Founder · Family Rentals | Go-to agent for families. Patient, detail-oriented, and known for finding pet-friendly and kid-safe homes across Awadhpuri and Govind Nagar. | 180+ | 5.0★ | 11 |
   | Amit Kumar (AK, teal→blue) | Head of Listings · Verification | Our listing quality gatekeeper. Amit personally visits every property before it goes live, so what you see online is exactly what you'll get. | 600+ (label "Verified") | 4.8★ | 9 |
   | Neha Mishra (NM, purple→pink) | Senior Agent · West Kanpur | Area specialist for Vikas Nagar, Kakadeo, and Vijay Nagar. Fastest deal turnaround in the team — average 7 days from first visit to closure. | 185+ | 4.9★ | 8 |
   | Rahul Sharma (RS, orange→red) | Agent · Bachelor & Pro Rentals | Relocated to Kanpur? Rahul specialises in rentals for young professionals and bachelors — budget flats near offices, metro, and good food. | 150+ | 4.8★ | 6 |
   | Priya Tiwari (PT, teal→blue) | Agent · South Kanpur | Covers Kidwai Nagar, Barra, and Shastri Nagar. Known for helping first-time renters navigate the process with zero stress. | 120+ | 4.9★ | 5 |
   (Stat labels: Deals · Rating · Yrs.)
4. **Area Coverage** (purple band): pill; H2 "Every neighborhood in **Kanpur**, covered"; sub "Hover to pause. Our agents operate across all major Kanpur areas — so wherever you need to rent, we have a local expert." Two rows of AreaCards scrolling in opposite directions (marquee, pause on hover, edge-fade mask): Row 1: Gurudev Chauraha, Kakadeo, Vijay Nagar, Vikas Nagar, Awas Vikas. Row 2: Sharda Nagar, Shastri Nagar, Barra, Panki, Kidwai Nagar (colors alternate teal / purple / red).
5. **Agent Promise** (2 cols): left = same purple + teal "device frame" visual as Home; right = pill "Agent Promise", H3 "What working with a PrimeHomeKanpur agent **actually means**", 4 rows (cyan icon square + bold title + text, divided):
   - You'll never feel pressured — "Our agents are salaried + incentivised on client ratings, not quick closures. No pushy sales, ever."
   - They know the area like a local — "Which societies have 24×7 water? Which areas flood in rains? Our agents live this information daily."
   - Fast, 24/7 responsiveness — "Average first response time is under 20 minutes. We actually answer calls — during work hours and on weekends."
   - Bonus: free move-in support — "Packer and mover referrals, utility setup help, and neighborhood tips — free with every closed deal."
6. CTA: "Want to work with a **specific agent?**" / "Tell us your preferred area, budget, or agent name — and we'll connect you directly. No IVR, no waiting, just real humans." / [Request an Agent] [📞 Call Now: +91 6398987290].

---

## 9. SERVICES PAGE `/services`

1. PageHero — pill "Our Services"; H1 "Complete rental solutions for **tenants & landlords**"; text "We handle everything from finding the perfect tenant to drafting lease agreements. Whether you're a first-time renter or a seasoned property owner, we have a service tailored for you."; breadcrumb Home / Services.
2. **Core Services**: pill; H2 "What we offer to make **renting effortless**"; sub "From search to move-in — and everything in between. Pick the service that fits your needs." 3 × 2 grid of ServiceCards (icon square, title, description, divider, 6 cyan-check bullets, bottom button):
   1. **Find a Rental** — "Browse verified rentals matched to your budget, preferred area, and move-in date. Personalised shortlisting and site visits arranged on your schedule." — Neighborhood & budget matching · Move-in date filtering · 100% verified listings only · Personalised property shortlist · Unlimited site visits until you decide · Rent negotiation support — [Browse Listings] cyan
   2. **List Your Rental** (red "Most Requested" badge) — "Get your property listed, professionally photographed, and rented out fast. We handle tenant screening, visits, and paperwork so you don't have to." — Free professional photography · Listed on 4+ rental platforms · Comprehensive tenant screening · Lease agreement drafting · Rent collection coordination · Security deposit escrow handling — [List Property Free] cyan
   3. **Renewals & Appraisal** — "Market conditions change every quarter. Get a free, data-backed rent appraisal so your renewals and pricing are always fair and competitive." — Data-driven market rent appraisal · Comparable property analysis · Lease renewal negotiation · Security deposit return handling · Rental agreement amendments · Vacancy marketing support — [Get Free Appraisal] outline
   4. **Tenant Verification** — "Peace of mind for landlords. Our multi-layer verification checks every tenant's background, employment, and financial stability before you sign." — Government ID verification (Aadhaar, PAN) · Employment & salary verification · Previous landlord reference check · Credit & CIBIL score check · Criminal / police background check · Family / personal reference call — [Request Verification] outline
   5. **Lease Documentation** — "Legally sound rental agreements drafted by experienced property lawyers. Avoid disputes with watertight contracts that protect both parties." — Standard 11-month lease drafting · Long-term lease agreements · Custom clauses (pets, maintenance) · Rent escalation terms · Stamp paper & registration support · Addendum & amendment drafting — [Draft Agreement] outline
   6. **Property Management** — "Sit back and relax while we manage everything for you — from monthly rent collection to maintenance coordination. Perfect for NRIs and outstation owners." — Monthly rent collection & remittance · Maintenance & repair coordination · Utility bill payment tracking · Quarterly property inspection · Monthly statement & P&L report · Dedicated relationship manager — [Learn More] outline
3. **Process** (purple band): pill; H2 "How our service delivery **actually works**"; sub "No black boxes, no hidden steps. A clear 4-stage process that keeps you in the loop at every stage." 4 StepCards: 1 Consultation — "We start by understanding your exact requirements — budget, area, BHK, timeline, and non-negotiables. This takes 15 minutes over a call." · 2 Shortlisting — "Our agent curates 5-8 verified properties that match your brief. You get photos, floor plans, and exact pricing on WhatsApp within 24 hours." · 3 Site Visits — "We coordinate with landlords and schedule site visits on your schedule. Our agent accompanies you, points out pros & cons, and answers every question." · 4 Closure & Support — "Once you finalise, we handle verification, lease drafting, payment coordination, and handover. We're available for 30 days post-move-in for any issues."
4. **Pricing**: pill; H2 "Simple, transparent **service fees**"; sub "No hidden charges. What you see is exactly what you pay — once." 3 cards:
   - **For Tenants** — big cyan "1 Month Rent" — "One-time brokerage · No recurring fees" — Unlimited listings access · Personalised shortlisting · All site visits included · Lease agreement drafted free · 30-day post-move-in support · Pay only after you sign the lease — [Start Searching] outline
   - **For Landlords** (red "Best Value" badge, highlighted border + glow) — "50% Off First Time" — "Half month rent as introduction offer" — Professional photography (Free) · Cross-platform listing (Free) · Full tenant verification · Lease agreement drafting (Free) · Rent & deposit coordination · Listing active for 90 days — [List Property Now] cyan
   - **Annual Management** — "5% of Annual Rent" — "All-inclusive · Monthly reports" — Complete tenant management · Monthly rent collection · Maintenance coordination · Quarterly property inspection · Utility payments handled · Dedicated account manager — [Custom Quote] outline
5. **FAQ teaser**: pill "Frequently Asked"; H3 "Questions about our **services?**"; "Still unsure which service is right for you? Read our FAQ or talk to our team — consultations are always free." [Read All FAQs] [Book Free Consultation].

---

## 10. FAQ PAGE `/faq`

1. PageHero — pill "FAQ"; H1 "Your rental questions, **honestly answered**"; text "Can't find what you're looking for? Call or email us — we answer every question within 24 hours, no exceptions."; breadcrumb Home / FAQs.
2. **Two columns** (left ~40% sticky, right ~60%):
   - **Left**: pill "Still confused?"; H3 "Have a question that's **not listed here?**"; "We get it — every rental situation is unique. Our team is just a call or message away, and consultations are completely free." Card "📞 Call Us Anytime" → `+91 6398987290`, "Mon – Sat, 9:00 AM – 8:00 PM / Sunday: 10:00 AM – 4:00 PM". Card "✉️ Email Us" → `pathak424448@gmail.com`, "Average reply within 4 hours on working days." Full-width cyan button "Send Us a Message →".
   - **Right**: grouped accordions (group label pill + list of rows separated by thin dividers, cyan `+` / `−` toggle at right, only one open per group, first item open by default, smooth height animation, accessible `aria-expanded`).
     - **For Tenants**: What is PrimeHomeKanpur? *(open by default: "PrimeHomeKanpur is Kanpur's most trusted rental platform, operating since 2012. We help tenants find, compare, and secure verified rental homes, and help landlords rent out their properties faster with quality tenants. We currently handle rentals only — not buy/sell transactions.")* · Do you help with buying or selling homes? · How often are listings updated? · Do I need an account to use PrimeHomeKanpur? · Can I contact an agent directly through your site? · What are your brokerage charges for tenants? · Are the listing photos accurate? · How do I schedule a site visit? · Do you help with lease agreements and paperwork?
     - **For Landlords**: How much do you charge to list my property? · How do you screen tenants for my property? · How long does it take to rent out my property? · What if the tenant stops paying rent or causes issues? · Do you handle rent collection and deposit management? · I'm an NRI / outstation owner. Can you fully manage my property?
     - **General & Legal**: Which areas in Kanpur do you currently cover? · Is my personal information safe with you? · What happens if I have a dispute with the landlord / tenant? · Do you have a physical office I can visit?
     - Write the missing answers (only the first is visible in the screenshot) consistent with the rest of the site: rentals only, since 2012, 43+ neighborhoods, tenants pay 1 month rent one-time, 11-month lease, 2-month refundable deposit, free lease drafting, 2-hour visit confirmation, office at Awadhpuri. Store all in the `faqs` table (group, question, answer, sort_order, is_published).
3. CTA: "Didn't find your answer? **We're here to help.**" / "Send us a quick message and one of our rental experts will get back to you personally within a few hours — no chatbots, no ticket numbers." / [Send a Message] [📞 Call +91 6398987290].

---

## 11. CONTACT PAGE `/contact`

1. PageHero — pill "Contact Us"; H1 "Let's talk about your **rental needs**"; text "Whether you're looking for a home, need to list your property, or just have questions — we respond to every single message within a few hours. Yes, really."; breadcrumb Home / Contact Us.
2. **Two columns**:
   - **Left — 4 stacked info cards** (icon square left, content right):
     - 📍 **Our Office** — "Awadhpuri, Near Sales Tax Office, Kanpur, Uttar Pradesh – 208024" · **Working Hours:** Mon – Sat: 9:00 AM – 8:00 PM · Sunday: 10:00 AM – 4:00 PM
     - 📞 **Call / WhatsApp** — `+91 6398987290` (large cyan) · "Open WhatsApp chat" underlined cyan link (`wa.me/916398987290`) · Average pick-up time: **under 3 rings** · Average response on WhatsApp: **18 minutes**
     - ✉️ **Email** — `pathak424448@gmail.com` (cyan) · General queries: reply within 4 hours · Urgent / deal-related: reply within 1 hour
     - 🚗 **Getting Here** — Nearest Bus Stop: Awadhpuri Stop (2 min walk) · Kanpur Central: 9 km (~25 min) · Kanpur Airport: 15 km (~35 min) · cyan "Free parking available for clients visiting our office"
   - **Right — form card**: pill "Send Us a Message"; H3 "We'd love to hear from you"; "Fill the form below — it takes less than 2 minutes. We'll get back to you personally." Fields: Full Name * · Phone Number * (2-col row) · Email Address · I'm interested in * (select: Renting a property / Listing my property / Property management / Rent appraisal / Lease documentation / Other) (2-col row) · Preferred Location (if searching) · Your Message / Requirements * (textarea, placeholder "Tell us a bit about what you're looking for — budget, BHK, move-in date, etc. The more detail, the better we can help!") · checkbox "I agree to the **Privacy Policy** and consent to PrimeHomeKanpur contacting me about my query." · full-width cyan [✉ Send Message]. Zod validation, inline errors, success/error state, saves to `contact_messages`.
   - Under the form: pill "Visit Our Office" + map card (grid pattern, cyan pin, "PrimeHomeKanpur Office", "Awadhpuri, Near Sales Tax Office Kanpur – 208024, Uttar Pradesh"). Allow later swap to a Google Maps iframe.
3. **Quick Help** (purple band): pill; H2 "Before you reach out — **maybe your answer is here**"; sub "Here are the questions we get every single day. Click any of them to jump straight to our FAQ." 4 cards (emoji icon square, bold question, muted answer with cyan arrow →, each links to /faq#id):
   - 💰 What are your fees? — "Tenants pay 1 month rent (one-time). Landlords get free first 60 days listing →"
   - 🔍 Are listings really verified? — "100% verified. Every property is physically visited by our Head of Listings before going live →"
   - 📄 Do you handle paperwork? — "Yes. Lease agreements drafted by property lawyers, free for all our clients →"
   - 🌏 Which areas do you cover? — "43+ Kanpur neighborhoods from Civil Lines to Barra. See the full list →"

---

## 12. SEED DATA

**Properties (12)** — slug, title, price, area, bhk, sqft, tenant_type, badge, gradient:
1. spacious-2bhk-apartment — ₹18,000 — Gurudev Chauraha — 2 BHK — 1,050 — Family — teal
2. cozy-studio-flat — ₹8,500 — Kakadeo — 1 BHK — 620 — Bachelor — red
3. luxurious-3bhk-duplex — ₹28,000 — Vijay Nagar — 3 BHK — 1,450 — Family — **Featured** — charcoal
4. modern-2bhk-with-balcony — ₹14,000 — Vikas Nagar — 2 BHK — 980 — Pro / Family — cyan (deposit ₹28,000, maintenance ₹1,200, floor 3 of 6, semi-furnished, 2 bath)
5. budget-friendly-1bhk — ₹7,000 — Awas Vikas — 1 BHK — 550 — Bachelor (Home card shows "Bachelor / Professional") — coral
6. premium-3bhk-villa — ₹24,000 — Swaroop Nagar — 3 BHK — 1,380 — Family — dark-teal
7. newly-built-2bhk-flat — ₹12,500 — Awadhpuri — 2 BHK — 900 — Family — violet
8. near-metro-1bhk — ₹9,500 — Kalyanpur — 1 BHK — 680 — Pro / Bachelor — light-violet
9. heritage-3bhk-apartment — ₹35,000 — Civil Lines — 3 BHK — 1,700 — Family — **Premium** — magenta
10. park-facing-2bhk — ₹15,500 — Govind Nagar — 2 BHK — 1,020 — Pro / Family — blue
11. compact-1bhk-flat — ₹8,000 — Kidwai Nagar — 1 BHK — 580 — Bachelor — green
12. 3bhk-with-terrace-garden — ₹22,000 — Barra — 3 BHK — 1,560 — Family — gold

Also seed: 6 agents (section 8), ~16+ areas (the 10 shown on Agents + Civil Lines, Awadhpuri, Swaroop Nagar, Govind Nagar, Kalyanpur…), all FAQs, all testimonials (Home 4 + About 3), site stats/settings (phone, email, address, hours, years, counts).

Make every count on the site (Total Reviews, Rentals Listed, Active Listings, "Showing X of Y", neighborhoods) read from the DB / `site_settings`, not hardcoded.

---

## 13. KNOWN ISSUES IN THE OLD SITE — FIX IN THE REBUILD

Reproduce the design, but do NOT copy these bugs:
1. **Amit Kumar avatar** on /agents renders the full name text instead of initials → must show "AK" like the others.
2. **Services → Annual Management card**: the "Utility payments handled" bullet overlaps/clips and the card has a mismatched purple shadow → clean list, same height as sibling cards.
3. **Property page "For Rent" badge** has a stray red outline box → render the same clean pale-pink pill used on cards.
4. **About stats** appear as tiny/empty in the screenshot because the count-up never fired → trigger count-up on scroll-into-view and show final values big in cyan.
5. **Inconsistent numbers** → single source of truth in the DB: Rajesh Pathak's years (14+ in bio, 12 on cards), "16+ neighborhoods" (Rentals steps) vs "43 neighborhoods" elsewhere, "67+ listings" vs "Showing 12". Use dynamic values; default to 43 neighborhoods and Rajesh = 14 yrs unless told otherwise.
6. **Landlord fee wording differs**: Services says "50% Off First Time — half month rent", About/Contact say "Landlords list free for the first 60 days". Keep the copy as shown but store fee text in `site_settings` so it can be corrected in one place.
7. Home hero avatar stack and area-card left fade are marquee edge masks — keep as intentional.

---

## 14. FUNCTIONALITY

- **Search / filters** (Home bar + Rentals bar): location, BHK, price range, tenant type → real Supabase queries, URL-synced, empty state ("No rentals match your filters") + reset.
- **Property detail routing** by slug, 404 for unknown/unpublished.
- **Schedule Tour**, **Contact form**, **Newsletter** → stored in Supabase (`property_inquiries`, `contact_messages`, `newsletter_subscribers`), validated with Zod, with spam protection (honeypot + rate limit).
- **Auth** (Supabase Auth): /login, /register, /forgot-password, /reset-password; roles `user`, `agent`, `admin`. Favorites ("Shortlist") for logged-in users; /profile, /favorites, /my-inquiries.
- **Admin** (protected, does not change public design): /admin dashboard, properties CRUD (+ image upload to Supabase Storage), agents CRUD, inquiries inbox (status: new / contacted / closed), users, FAQs, testimonials, areas, settings.
- **Payments**: not part of this phase unless the owner asks; keep the code ready for a future gateway (Razorpay).
- **Security**: RLS enabled on every table (public read of published rows only; writes via authenticated roles; service-role key server-only), input validation everywhere, no secrets in client bundle.
- **Utility pages**: /privacy-policy, /terms, /cookie-policy.
- **SEO/A11y**: metadata + OpenGraph per page, semantic landmarks, alt text, focus states, keyboard-accessible accordions/menus, `prefers-reduced-motion` respected.

## 15. RESPONSIVE RULES

- ≥1280px: desktop exactly as screenshots (container ~1200–1280px, 4-col property grid, 3-col agents/services).
- 768–1279px: 2-col grids, search bar 2×2, sidebars stack under main content.
- <768px: single column, hamburger header, search bar stacked, stats 2×2, marquees remain, buttons full-width in CTA banners, form fields stack.

## 16. ANIMATIONS (subtle only)

Fade/slide-up on scroll, count-up stats, card hover lift + border glow, marquee for areas, accordion height transition. Nothing flashy; no animation that isn't implied by the screenshots.

## 17. BUILD PROCESS (follow in order)

1. Project setup + tokens + fonts → 2. Header/Footer/Button/Pill/PageHero/CtaBanner → 3. Home → 4. Rentals + PropertyCard → 5. Property Details → 6. Agents → 7. About → 8. Services → 9. FAQ → 10. Contact → 11. Supabase schema/migrations/seed/RLS → 12. Wire data layer → 13. Auth + favorites → 14. Admin → 15. Validation/loading/error states → 16. SEO/a11y/responsive pass → 17. `npm run build` clean.

**After each page: compare against its screenshot (container width, section spacing, grid columns, card size, colors, gradients, typography, badges, footer) and fix differences before moving on.** Do not build all pages from generic sections and assume they match.

## 18. ACCEPTANCE CRITERIA

- [ ] All 8 pages visually match their screenshots (same section order, copy, colors, card shapes)
- [ ] One reusable Header, Footer, PropertyCard, AgentCard, PageHero, CtaBanner
- [ ] Header CTA changes per page as listed; active nav pill is cyan
- [ ] Filters/search work and are URL-synced; property detail routing works
- [ ] Forms (visit, contact, newsletter) save to Supabase with validation
- [ ] Auth, favorites, admin CRUD (properties, agents, FAQs, testimonials, inquiries) work
- [ ] RLS on all tables and tested; secrets not exposed; `.env.example` present
- [ ] Known issues in section 13 fixed
- [ ] Responsive on mobile/tablet/desktop
- [ ] No dead code, no duplicate components, no broken routes, no console errors
- [ ] README + migrations + seed.sql exist; `npm run build` succeeds

**Final rule:** the result must feel like "the old PrimeHomeKanpur website rebuilt from scratch with clean production architecture" — NOT "a new website inspired by the old one."
