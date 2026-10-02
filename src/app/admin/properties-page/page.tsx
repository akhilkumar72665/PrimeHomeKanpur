'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { RentalsPageSettings } from '@/types/admin'
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Globe,
  LayoutGrid,
  Filter,
  Star,
  Type,
  X,
  Upload,
} from 'lucide-react'

const DEFAULT_RENTALS_SETTINGS: RentalsPageSettings = {
  title: 'Rental Properties in Kanpur',
  subtitle: 'Find your perfect home with physically verified listings',
  bannerImage: null,
  filters: {
    location: true,
    type: true,
    rent: true,
    bedrooms: true,
    furnishing: true,
    search: true,
  },
  listing: {
    sort: 'newest',
    perPage: 9,
    layout: 'grid',
    showRented: true,
    showRatings: true,
  },
  featured: {
    enabled: true,
    title: 'Featured Rentals in Kanpur',
    max: 3,
  },
  seo: {
    title: 'Rental Properties in Kanpur | PrimeHomeKanpur',
    description: 'Browse physically verified apartments, flats, and houses for rent in Kanpur with PrimeHomeKanpur.',
  },
}

export default function AdminPropertiesPageCustomizer() {
  const { user, can } = useAuth()
  const [settings, setSettings] = useState<RentalsPageSettings>(DEFAULT_RENTALS_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('page_settings')
        .select('value')
        .eq('key', 'rentals')
        .maybeSingle()

      if (data?.value) {
        setSettings({
          ...DEFAULT_RENTALS_SETTINGS,
          ...data.value,
          filters: { ...DEFAULT_RENTALS_SETTINGS.filters, ...(data.value.filters || {}) },
          listing: { ...DEFAULT_RENTALS_SETTINGS.listing, ...(data.value.listing || {}) },
          featured: { ...DEFAULT_RENTALS_SETTINGS.featured, ...(data.value.featured || {}) },
          seo: { ...DEFAULT_RENTALS_SETTINGS.seo, ...(data.value.seo || {}) },
        })
      }
    } catch (err: unknown) {
      console.error('Failed to load page settings:', err)
      setErrorMessage('Failed to load settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!can('page_settings.update')) return

    try {
      setSaving(true)
      setErrorMessage(null)

      const { error } = await supabase.from('page_settings').upsert({
        key: 'rentals',
        value: settings,
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'SETTINGS_CHANGE',
        entity: 'page_settings',
        entity_id: 'rentals',
        summary: 'Updated public Rentals page customization settings',
        details: settings as any,
      })

      setSuccessMessage('Public Rentals page settings saved successfully!')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    if (confirm('Reset Rentals page customization to default settings?')) {
      setSettings(DEFAULT_RENTALS_SETTINGS)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rentals Page Customizer
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Customize header texts, filter toggles, layout sorting, and SEO for the public `/rentals` page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-text-secondary hover:text-white transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Page Header */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <Type size={18} className="text-primary" />
            <h2 className="text-base font-bold text-white">Header &amp; Hero Section</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Page Headline Title
              </label>
              <input
                type="text"
                required
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Subtitle Description
              </label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Search & Filters Visibility */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <Filter size={18} className="text-cyan-400" />
            <h2 className="text-base font-bold text-white">Public Filters Toggles</h2>
          </div>

          <p className="text-xs text-text-secondary">
            Enable or disable specific filter controls on the public rentals discovery bar.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'location', label: 'Kanpur Area Location' },
              { key: 'type', label: 'Property Type (Flat/PG)' },
              { key: 'rent', label: 'Price / Budget Range' },
              { key: 'bedrooms', label: 'Bedrooms (BHK)' },
              { key: 'furnishing', label: 'Furnishing Status' },
              { key: 'search', label: 'Keyword Search Box' },
            ].map(({ key, label }) => {
              const filterKey = key as keyof RentalsPageSettings['filters']
              const isEnabled = settings.filters[filterKey]
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isEnabled
                      ? 'bg-primary/10 border-primary/40 text-white'
                      : 'bg-white/[0.02] border-white/10 text-text-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        filters: { ...settings.filters, [filterKey]: e.target.checked },
                      })
                    }
                    className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-semibold">{label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Section 3: Listing Layout & Display */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <LayoutGrid size={18} className="text-purple-400" />
            <h2 className="text-base font-bold text-white">Catalog Layout &amp; Sorting</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Default Sort Order
              </label>
              <select
                value={settings.listing.sort}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    listing: { ...settings.listing, sort: e.target.value as any },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="featured">Featured First</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Properties Per Page
              </label>
              <select
                value={settings.listing.perPage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    listing: { ...settings.listing, perPage: Number(e.target.value) },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value={6}>6 per page</option>
                <option value={9}>9 per page</option>
                <option value={12}>12 per page</option>
                <option value={18}>18 per page</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Layout Mode
              </label>
              <select
                value={settings.listing.layout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    listing: { ...settings.listing, layout: e.target.value as any },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="grid">3-Column Grid</option>
                <option value="list">Single Column List</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={settings.listing.showRented}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    listing: { ...settings.listing, showRented: e.target.checked },
                  })
                }
                className="rounded border-white/20 bg-white/5 text-primary"
              />
              <span>Display Rented properties with badge</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={settings.listing.showRatings}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    listing: { ...settings.listing, showRatings: e.target.checked },
                  })
                }
                className="rounded border-white/20 bg-white/5 text-primary"
              />
              <span>Show review rating stars on cards</span>
            </label>
          </div>
        </div>

        {/* Section 4: Featured Strip */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <Star size={18} className="text-amber-400" />
              <h2 className="text-base font-bold text-white">Featured Properties Carousel</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-primary">
              <input
                type="checkbox"
                checked={settings.featured.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    featured: { ...settings.featured, enabled: e.target.checked },
                  })
                }
                className="rounded border-white/20 bg-white/5 text-primary"
              />
              <span>Enabled</span>
            </label>
          </div>

          {settings.featured.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Featured Strip Title
                </label>
                <input
                  type="text"
                  value={settings.featured.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      featured: { ...settings.featured, title: e.target.value },
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Max Featured Items
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={settings.featured.max}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      featured: { ...settings.featured, max: Number(e.target.value) },
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 5: SEO Meta Tags */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <Globe size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white">SEO &amp; Meta Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Meta Title Tag
              </label>
              <input
                type="text"
                value={settings.seo.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, title: e.target.value },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={settings.seo.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, description: e.target.value },
                  })
                }
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving || !can('page_settings.update')}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] font-bold text-sm shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Customizations...' : 'Save Rentals Customizations'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
