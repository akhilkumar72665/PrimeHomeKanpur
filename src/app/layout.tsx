import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#07050F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://prime-home-kanpur.netlify.app"),
  title: "PrimeHomeKanpur — Verified Rental Properties in Kanpur",
  description: "Kanpur's most trusted rental marketplace. Browse 100% physically verified apartments, flats, and houses for rent in Kakadeo, Swaroop Nagar, Civil Lines, and more.",
  keywords: ["rental Kanpur", "flat for rent Kanpur", "house for rent Kanpur", "Kakadeo flat", "Swaroop Nagar apartment", "PrimeHomeKanpur"],
  openGraph: {
    title: "PrimeHomeKanpur — Verified Rental Properties in Kanpur",
    description: "Browse 100% physically verified apartments, flats, and houses for rent in Kanpur. Instant physical visit booking.",
    url: "https://prime-home-kanpur.netlify.app",
    siteName: "PrimeHomeKanpur",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimeHomeKanpur — Verified Rental Properties in Kanpur",
    description: "Browse verified rental flats, apartments, and houses across prime Kanpur areas.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "PrimeHomeKanpur",
  "image": "https://prime-home-kanpur.netlify.app/favicon.ico",
  "telephone": "+919151435647",
  "email": "primehomekanpur@gmail.com",
  "url": "https://prime-home-kanpur.netlify.app",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Awadhpuri, Near Sales Tax Office",
    "addressLocality": "Kanpur",
    "postalCode": "208024",
    "addressRegion": "Uttar Pradesh",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 26.4499,
    "longitude": 80.3319
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:30",
      "closes": "19:30"
    }
  ],
  "priceRange": "₹5,000 - ₹50,000"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

