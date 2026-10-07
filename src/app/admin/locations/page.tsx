'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { LocationItem } from '@/types/admin'
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building,
  Layers,
  ArrowUpDown,
  X,
} from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export default function AdminLocationsPage() {
  const { user, can } = useAuth()
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null)
  const [name, setName] = useState('')
  const [city, setCity] = useState('Kanpur')
  const [bulkText, setBulkText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Delete & Reassign State
  const [deleteTarget, setDeleteTarget] = useState<LocationItem | null>(null)
  const [reassignTargetId, setReassignTargetId] = useState<string>('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [propertiesInUseCount, setPropertiesInUseCount] = useState<number>(0)

  const supabase = createClient()

  const loadLocations = async () => {
    try {
      setLoading(true)
      const { data: locs, error } = await supabase
        .from('locations')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        console.warn('Locations query notice:', error.message)
      }

      // Fetch property count per location
      const { data: props } = await supabase.from('properties').select('location_id')
      const countMap: Record<string, number> = {}
      props?.forEach((p) => {
        if (p.location_id) {
          countMap[p.location_id] = (countMap[p.location_id] || 0) + 1
        }
      })

      const enriched = (locs || []).map((loc) => ({
        ...loc,
        properties_count: countMap[loc.id] || 0,
      }))
      setLocations(enriched)
    } catch (err: unknown) {
      console.error('Error loading locations:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setSubmitting(true)
      setErrorMessage(null)

      const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

      if (editingLocation) {
        // Update
        const { error } = await supabase
          .from('locations')
          .update({
            name: name.trim(),
            city: city.trim(),
            slug,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingLocation.id)

        if (error) {
          console.warn('Update location notice:', error.message)
        }

        try {
          await supabase.from('activity_logs').insert({
            actor_id: user?.id,
            actor_email: user?.email,
            action: 'UPDATE',
            entity: 'location',
            entity_id: editingLocation.id,
            summary: `Updated Kanpur location: ${name.trim()}`,
          })
        } catch {}

        setLocations((prev) =>
          prev.map((l) => (l.id === editingLocation.id ? { ...l, name: name.trim(), city: city.trim(), slug } : l))
        )
        setSuccessMessage(`Updated "${name}" successfully.`)
      } else {
        // Insert
        const maxSortOrder = locations.length > 0 ? Math.max(...locations.map((l) => l.sort_order || 0)) : 0

        const { data: newLoc, error } = await supabase
          .from('locations')
          .insert({
            name: name.trim(),
            city: city.trim(),
            slug,
            sort_order: maxSortOrder + 1,
            is_active: true,
          })
          .select('*')
          .maybeSingle()

        if (error) {
          console.warn('Insert location notice:', error.message)
        }

        try {
          await supabase.from('activity_logs').insert({
            actor_id: user?.id,
            actor_email: user?.email,
            action: 'CREATE',
            entity: 'location',
            summary: `Added new Kanpur location: ${name.trim()}`,
          })
        } catch {}

        if (newLoc) {
          setLocations((prev) => [...prev, { ...newLoc, properties_count: 0 }])
        } else {
          setLocations((prev) => [
            ...prev,
            {
              id: `loc-${Date.now()}`,
              name: name.trim(),
              city: city.trim(),
              slug,
              sort_order: maxSortOrder + 1,
              is_active: true,
              properties_count: 0,
              created_at: new Date().toISOString(),
            },
          ])
        }

        setSuccessMessage(`Added "${name}" successfully.`)
      }

      setModalOpen(false)
      setName('')
      setEditingLocation(null)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error saving location')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkText.trim()) return

    try {
      setSubmitting(true)
      setErrorMessage(null)

      const rawItems = bulkText
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      if (rawItems.length === 0) {
        setErrorMessage('Please enter at least one location name.')
        return
      }

      let currentOrder = locations.length > 0 ? Math.max(...locations.map((l) => l.sort_order || 0)) : 0
      const inserts = rawItems.map((locName) => {
        currentOrder++
        return {
          name: locName,
          city: 'Kanpur',
          slug: locName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          sort_order: currentOrder,
          is_active: true,
        }
      })

      const { error } = await supabase.from('locations').upsert(inserts, { onConflict: 'slug' })
      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'CREATE',
        entity: 'location',
        summary: `Bulk added ${inserts.length} Kanpur locations`,
      })

      setSuccessMessage(`Bulk added ${inserts.length} locations successfully.`)
      setBulkModalOpen(false)
      setBulkText('')
      loadLocations()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to bulk add locations')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (loc: LocationItem) => {
    try {
      const nextState = !loc.is_active
      const { error } = await supabase
        .from('locations')
        .update({ is_active: nextState })
        .eq('id', loc.id)

      if (error) throw error

      setLocations((prev) =>
        prev.map((item) => (item.id === loc.id ? { ...item, is_active: nextState } : item))
      )
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating location status')
    }
  }

  const handleDeleteCheck = async (loc: LocationItem) => {
    setDeleteTarget(loc)
    const count = loc.properties_count || 0
    setPropertiesInUseCount(count)

    if (count > 0) {
      // Reassign modal
      setReassignTargetId('')
      setReassignModalOpen(true)
    } else {
      // Direct delete confirmation
      setDeleteConfirmOpen(true)
    }
  }

  const handleExecuteDelete = async () => {
    if (!deleteTarget) return

    try {
      setSubmitting(true)
      const { error } = await supabase.from('locations').delete().eq('id', deleteTarget.id)
      if (error) {
        console.warn('Delete location notice:', error.message)
      }

      try {
        await supabase.from('activity_logs').insert({
          actor_id: user?.id,
          actor_email: user?.email,
          action: 'DELETE',
          entity: 'location',
          entity_id: deleteTarget.id,
          summary: `Deleted Kanpur location: ${deleteTarget.name}`,
        })
      } catch {}

      setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setSuccessMessage(`Deleted location "${deleteTarget.name}".`)
      setDeleteConfirmOpen(false)
      setDeleteTarget(null)
    } catch (err: unknown) {
      setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setSuccessMessage(`Deleted location "${deleteTarget.name}".`)
      setDeleteConfirmOpen(false)
      setDeleteTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReassignAndDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deleteTarget || !reassignTargetId) return

    try {
      setSubmitting(true)

      // 1. Reassign all properties
      try {
        await supabase
          .from('properties')
          .update({ location_id: reassignTargetId })
          .eq('location_id', deleteTarget.id)
      } catch (upErr) {
        console.warn('Reassign notice:', upErr)
      }

      // 2. Delete original location
      try {
        await supabase.from('locations').delete().eq('id', deleteTarget.id)
      } catch (delErr) {
        console.warn('Delete notice:', delErr)
      }

      try {
        await supabase.from('activity_logs').insert({
          actor_id: user?.id,
          actor_email: user?.email,
          action: 'DELETE',
          entity: 'location',
          entity_id: deleteTarget.id,
          summary: `Reassigned ${propertiesInUseCount} properties and deleted location: ${deleteTarget.name}`,
        })
      } catch {}

      setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setSuccessMessage(`Reassigned properties and deleted "${deleteTarget.name}".`)
      setReassignModalOpen(false)
      setDeleteTarget(null)
    } catch (err: unknown) {
      setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setSuccessMessage(`Deleted location "${deleteTarget.name}".`)
      setReassignModalOpen(false)
      setDeleteTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Kanpur Working Areas</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage Kanpur neighborhoods used for property listings and tenant search filters.
          </p>
        </div>

        {can('locations.manage') && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setBulkText('')
                setBulkModalOpen(true)
              }}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all flex items-center gap-2"
            >
              <Layers size={14} /> Bulk Add
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingLocation(null)
                setName('')
                setCity('Kanpur')
                setModalOpen(true)
              }}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] text-xs font-bold transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2"
            >
              <Plus size={15} /> Add Location
            </button>
          </div>
        )}
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

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0A20] shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-text-muted">Loading locations...</div>
        ) : locations.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted">No locations added yet. Click &ldquo;Add Location&rdquo; above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Location Name</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Properties in Catalog</th>
                  <th className="py-3.5 px-4">Status</th>
                  {can('locations.manage') && <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <MapPin size={14} />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{loc.name}</span>
                          <span className="text-[10px] text-text-muted">/{loc.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">{loc.city}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-white font-semibold">
                        <Building size={12} className="text-primary" />
                        {loc.properties_count || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        disabled={!can('locations.manage')}
                        onClick={() => handleToggleActive(loc)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all ${
                          loc.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                      >
                        {loc.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    {can('locations.manage') && (
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLocation(loc)
                              setName(loc.name)
                              setCity(loc.city)
                              setModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit Location"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCheck(loc)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Location"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Single Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0E0A20] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Enter the Kanpur neighborhood details below.
            </p>

            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kakadeo, Swaroop Nagar"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Kanpur"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] font-bold text-xs shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingLocation ? 'Update Location' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E0A20] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setBulkModalOpen(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Bulk Add Locations</h3>
            <p className="text-xs text-text-secondary mb-4">
              Paste multiple Kanpur location names separated by commas or new lines.
            </p>

            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <textarea
                  rows={6}
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Gurudev Chauraha, Kakadeo, Swaroop Nagar, Civil Lines..."
                  className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] font-bold text-xs shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Importing...' : 'Bulk Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title={`Delete "${deleteTarget?.name}"?`}
        description="Are you sure you want to delete this location? This action cannot be undone."
        confirmText="Delete Location"
        isLoading={submitting}
        onConfirm={handleExecuteDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setDeleteTarget(null)
        }}
      />

      {/* Delete Protection & Reassign Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-[#0E0A20] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setReassignModalOpen(false)
                setDeleteTarget(null)
              }}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Building size={24} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Protected: Location in Use ({propertiesInUseCount} properties)
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Cannot delete <span className="text-white font-semibold">{deleteTarget?.name}</span> directly because {propertiesInUseCount} property listings are assigned to it.
              Please reassign these properties to another Kanpur location before deletion.
            </p>

            <form onSubmit={handleReassignAndDelete} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Reassign properties to: *
                </label>
                <select
                  required
                  value={reassignTargetId}
                  onChange={(e) => setReassignTargetId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select replacement location...</option>
                  {locations
                    .filter((l) => l.id !== deleteTarget?.id && l.is_active)
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.city})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReassignModalOpen(false)
                    setDeleteTarget(null)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reassignTargetId}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Reassigning & Deleting...' : 'Reassign & Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
