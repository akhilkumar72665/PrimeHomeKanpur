import Link from 'next/link'
import { Home, Search, Phone, Building, MapPin } from 'lucide-react'

export const metadata = {
  title: '404 - Page Not Found | PrimeHomeKanpur',
  description: 'The requested rental listing or page could not be found on PrimeHomeKanpur.',
}

export default function NotFound() {
  const popularLocalities = [
    'Kakadeo',
    'Swaroop Nagar',
    'Civil Lines',
    'Sharda Nagar',
    'Kidwai Nagar',
    'Indira Nagar',
  ]

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xl text-center relative z-10 space-y-6">
        {/* Branded 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent-cyan text-xs font-bold uppercase tracking-widest">
          <Building size={14} /> 404 Error · Listing or Page Not Found
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Lost in Kanpur?
        </h1>

        <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          The property listing, neighborhood directory, or page you are looking for may have been rented, relocated, or doesn&apos;t exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/rentals"
            className="btn btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-950/50"
          >
            <Search size={16} /> Explore Verified Rentals
          </Link>

          <Link
            href="/"
            className="btn btn-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white border border-white/10 hover:border-accent-cyan inline-flex items-center gap-2"
          >
            <Home size={16} /> Back to Homepage
          </Link>

          <Link
            href="/contact"
            className="btn btn-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-text-secondary hover:text-white border border-white/10 inline-flex items-center gap-2"
          >
            <Phone size={16} /> Contact Support
          </Link>
        </div>

        {/* Quick Links to Popular Kanpur Localities */}
        <div className="pt-8 border-t border-white/10 text-left">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block text-center mb-3">
            Popular Rental Localities in Kanpur
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {popularLocalities.map((loc) => (
              <Link
                key={loc}
                href={`/rentals?locality=${encodeURIComponent(loc)}`}
                className="px-3 py-1.5 rounded-xl bg-[#0E0B1F] border border-white/10 text-xs text-text-secondary hover:text-white hover:border-primary transition-all flex items-center gap-1.5"
              >
                <MapPin size={12} className="text-accent-cyan" /> {loc}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
