# Project Context & Engineering Memory (MEMORY.md) — PrimeHomeKanpur

---

## 1. Project Background & Context
- **Project Name**: PrimeHomeKanpur
- **Live Production URL**: `https://primehomekanpur.vercel.app/`
- **Primary Domain**: Kanpur Urban Real Estate & Rental Housing Marketplace
- **Primary GitHub Repository**: `https://github.com/akhilkumar72665/PrimeHomeKanpur`
- **Default Branch**: `main`

---

## 2. Key Architecture & Technology Decisions

### 2.1 Next.js 16 (App Router + Turbopack) & Proxy Migration
- **Decision**: The project uses Next.js `16.3.8`.
- **Proxy Convention**: In Next.js 16, the legacy `middleware.ts` file convention is deprecated in favor of `src/proxy.ts` exporting `export async function proxy(request: NextRequest)`.
- **Reason**: Decouples edge proxying and security headers from runtime middleware pipelines while delivering sub-millisecond route guarding.

### 2.2 Supabase SSR Authentication (`@supabase/ssr`)
- **Decision**: Uses `@supabase/ssr` instead of the legacy `@supabase/auth-helpers-nextjs`.
- **Implementation**:
  - `src/lib/supabase/client.ts` — Browser client for client components.
  - `src/lib/supabase/server.ts` — Server component client utilizing Next.js `cookies()`.
  - `src/lib/supabase/admin.ts` — Privileged service role client for administrative server actions.

### 2.3 Styling & CSS Architecture
- **Decision**: Hybrid approach using **Tailwind CSS v4** combined with custom design system variables in `src/styles/tokens.css` and `src/app/globals.css`.
- **Rationale**: Provides instant utility layout classes with pixel-perfect bespoke dark glassmorphic design and rich micro-animations.

---

## 3. Database & SQL Architecture Conventions

### Master Provisioning Scripts (`supabase/`):
1. **`FINAL_SUPABASE_SETUP.sql`**: Master schema creating enum types (`user_role`, `property_status`, `visit_status`, `inquiry_status`), tables, indexes, triggers, and foreign keys.
2. **`COMPLETE_ADMIN_AND_PERMISSIONS_FIX.sql`**: Configures PostgreSQL functions (`is_admin()`, `get_auth_role()`) and Row-Level Security policies allowing both standard tenant/landlord operations and super-admin full overrides.
3. **`seed.sql`**: Initial verified listings across Kanpur (Kakadeo, Swaroop Nagar, Civil Lines, Kalyanpur, Gurudev Chauraha, etc.), sample agents, and FAQ collections.

---

## 4. Environment Variables Dictionary

```env
# ==========================================
# PUBLIC CLIENT VARIABLES (Config Type)
# ==========================================
# Supabase Project HTTPS API URL
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co

# Supabase Anonymous Public API Key (or Publishable Key)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_key_...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Canonical Site URL (Used for SEO canonicals, sitemaps, auth redirect URLs)
NEXT_PUBLIC_SITE_URL=https://primehomekanpur.vercel.app

# Razorpay Public Key ID (Client-side checkout modal)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...

# ==========================================
# PRIVATE SERVER SECRETS (Secret Type 🔒)
# ==========================================
# Supabase Service Role Secret Key (Bypasses RLS for admin server actions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Razorpay Webhook & Verification Key Secret (Server-side HMAC verification)
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```

---

## 5. Developer Gotchas & Operational Guidelines
1. **Never commit `.env` or `.env.local`**: Gitignore is strictly configured to protect live production keys.
2. **Next.js 16 Edge Proxy**: Do not create a `src/middleware.ts` file alongside `src/proxy.ts` — Next.js 16 will emit deprecation warnings. Always edit `src/proxy.ts`.
3. **Image Optimization**: When adding external image domains, add the hostname into `next.config.ts` under `images.remotePatterns`.
4. **Vercel Deployment**: Ensure all environment variables are saved in Vercel Project Settings before building.
