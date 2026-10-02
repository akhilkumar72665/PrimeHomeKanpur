'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Location } from '@/types'
import { locations as mockLocMap } from '@/lib/data/mockData'
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Check,
  AlertCircle
} from 'lucide-react'

export default function AdminLocationsPage() {
  const [locationsList, setLocationsList] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLoc, setEditingLoc] = useState<Location | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [city, setCity] = useState('Kanpur')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const supabase = createClient()

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('display_order', { ascending: true })

      if (!error && data && data.length > 0) {
        setLocationsList(data as Location[])
      } else {
        setLocationsList(Object.values(mockLocMap))
      }
    } catch {
      setLocationsList(Object.values(mockLocMap))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const openAddModal = () => {
    setEditingLoc(null)
    setName('')
    setSlug('')
    setCity('Kanpur')
    setDescription('')
    setIsActive(true)
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (loc: Location) => {
    setEditingLoc(loc)
    setName(loc.name)
    setSlug(loc.slug)
    setCity(loc.city || 'Kanpur')
    setDescription(loc.description || '')
    setIsActive(loc.is_active)
    setFormError(null)
    setModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingLoc) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      )
    }
  }

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name || !slug) {
      setFormError('Name and slug are required.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name,
        slug,
        city,
        description: description || null,
        is_active: isActive,
      }

      if (editingLoc) {
        const { error } = await supabase
          .from('locations')
          .update(payload)
          .eq('id', editingLoc.id)

        if (error) throw error

        setLocationsList((prev) =>
          prev.map((l) => (l.id === editingLoc.id ? { ...l, ...payload } : l))
        )
      } else {
        const { data, error } = await supabase
          .from('locations')
          .insert(payload)
          .select('*')
          .single()

        if (error) {
          const newLoc: Location = {
            id: `loc-${Date.now()}`,
            ...payload,
            image: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setLocationsList((prev) => [...prev, newLoc])
        } else if (data) {
          setLocationsList((prev) => [...prev, data as Location])
        }
      }

      setModalOpen(false)
    } catch (err: any) {
      setFormError(err.message || 'Failed to save location.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return
    try {
      await supabase.from('locations').delete().eq('id', id)
      setLocationsList((prev) => prev.filter((l) => l.id !== id))
    } catch {
      setLocationsList((prev) => prev.filter((l) => l.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin size={22} className="text-amber-400" /> Kanpur Locations Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage supported neighborhoods and area coverage for rental listings
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md self-start sm:self-auto"
        >
          <Plus size={15} /> Add Location
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading locations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationsList.map((loc) => (
            <div
              key={loc.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 flex flex-col justify-between hover:border-amber-400/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin size={15} className="text-accent-pink" />
                    {loc.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      loc.is_active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    {loc.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted font-mono mb-2">/{loc.slug}</p>
                <p className="text-xs text-text-secondary">
                  {loc.description || `${loc.name} rental hub in Kanpur`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(loc)}
                  className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                  title="Edit Location"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Location"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Location Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              {editingLoc ? 'Edit Location' : 'Add New Location'}
            </h2>
            <p className="text-xs text-text-secondary mb-5">
              Specify neighborhood details for property listing assignment
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Area / Neighborhood Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Kakadeo"
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kakadeo"
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short note about the area..."
                  className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-amber-400"
                  />
                  <span>Active & Available for Listings</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  {saving ? 'Saving...' : editingLoc ? 'Update' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
