import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { PopularArea } from '@/lib/data/areas'

export default function LocationAreaCard({ area }: { area: PopularArea }) {
  return (
    <Link
      href={`/rentals?location=${encodeURIComponent(area.name)}`}
      className={`group block w-[210px] shrink-0 rounded-2xl border border-white/15 bg-gradient-to-br p-4 shadow-lg shadow-black/40 transition-all hover:scale-[1.04] active:scale-95 sm:w-[240px] sm:p-5 ${area.grad}`}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-white/90">
        <MapPin size={13} className="shrink-0" /> Kanpur
      </div>
      <h3 className="truncate text-base font-extrabold leading-tight text-white sm:text-lg">
        {area.name}
      </h3>
      <p className="mt-2 flex items-center justify-between text-xs font-medium text-white/80">
        <span>{area.count}</span>
        <ArrowRight size={13} className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </p>
    </Link>
  )
}