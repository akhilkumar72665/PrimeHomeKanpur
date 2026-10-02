import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrimeHomeKanpur - Find Your Perfect Rental Home in Kanpur",
  description: "Kanpur's most trusted rental marketplace. Browse verified listings, get landlord-ready support, and move in with confidence. Since 2012.",
  keywords: ["rental", "Kanpur", "real estate", "apartment", "flat", "PG", "property"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
