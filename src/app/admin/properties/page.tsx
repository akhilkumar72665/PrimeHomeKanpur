'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Property, Location } from '@/types'
import { mockProperties, locations as mockLocMap } from '@/lib/data/mockData'
import {
  Building,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  X,
  Upload,
  Film,
  Image as ImageIcon,
  Check
} from 'lucide-react'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(15000)
  const [deposit, setDeposit] = useState<number>(30000)
  const [maintenance, setMaintenance] = useState<number>(1000)
  const [propertyType, setPropertyType] = useState('Apartment')
  const [bhk, setBhk] = useState<number>(2)
  const [bathrooms, setBathrooms] = useState<number>(2)
  const [areaSqft, setAreaSqft] = useState<number>(1200)
  const [tenantType, setTenantType] = useState<Property['tenant_type']>('Family')
  const [furnishing, setFurnishing] = useState('Semi-Furnished')
  const [locationId, setLocationId] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<Property['status']>('AVAILABLE')
  const [featured, setFeatured] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])

  const supabase = createClient()

  const loadProperties = async () => {
    try {
      const [propRes, locRes] = await Promise.all([
        supabase.from('properties').select('*, location:locations(*), images:property_images(*)').order('created_at', { ascending: false }),
        supabase.from('locations').select('*').eq('is_active', true).order('name', { ascending: true })
      ])

      if (!propRes.error && propRes.data && propRes.data.length > 0) {
        setProperties(propRes.data as Property[])
      } else {
        setProperties(mockProperties)
      }

      if (!locRes.error && locRes.data && locRes.data.length > 0) {
        setLocations(locRes.data as Location[])
      } else {
        setLocations(Object.values(mockLocMap))
      }
    } catch (err) {
      console.error('Failed to load admin properties:', err)
      setProperties(mockProperties)
      setLocations(Object.values(mockLocMap))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const openAddModal = () => {
    setEditingProperty(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setPrice(15000)
    setDeposit(30000)
    setMaintenance(1000)
    setPropertyType('Apartment')
    setBhk(2)
    setBathrooms(2)
    setAreaSqft(1200)
    setTenantType('Family')
    setFurnishing('Semi-Furnished')
    setLocationId(locations[0]?.id || '')
    setAddress('')
    setStatus('AVAILABLE')
    setFeatured(false)
    setVideoUrl('')
    setImageUrls([''])
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (property: Property) => {
    setEditingProperty(property)
    setTitle(property.title)
    setSlug(property.slug)
    setDescription(property.description)
    setPrice(property.price)
    setDeposit(property.security_deposit || property.price * 2)
    setMaintenance(property.maintenance || 0)
    setPropertyType(property.property_type)
    setBhk(property.bhk)
    setBathrooms(property.bathrooms || 1)
    setAreaSqft(property.area_sqft)
    setTenantType(property.tenant_type)
    setFurnishing(property.furnishing || 'Semi-Furnished')
    setLocationId(property.location_id || locations[0]?.id || '')
    setAddress(property.address)
    setStatus(property.status)
    setFeatured(property.featured)
    setVideoUrl(property.video_url || '')
    const imgs = property.images?.map((i) => i.image_url) || []
    setImageUrls(imgs.length > 0 ? imgs : [''])
    setFormError(null)
    setModalOpen(true)
  }

  // Auto slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!editingProperty) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setSlug(generatedSlug)
    }
  }

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title || !slug || !price || !address) {
      setFormError('Please fill in all required fields.')
      return
    }

    setSaving(true)

    try {
      const propertyPayload = {
        title,
        slug,
        description: description || title,
        price: Number(price),
        security_deposit: Number(deposit),
        maintenance: Number(maintenance),
        property_type: propertyType,
        bhk: Number(bhk),
        bathrooms: Number(bathrooms),
        area_sqft: Number(areaSqft),
        tenant_type: tenantType,
        furnishing,
        location_id: locationId || null,
        address,
        status,
        featured,
        video_url: videoUrl || null,
      }

      if (editingProperty) {
        // Update Property
        const { error } = await supabase
          .from('properties')
          .update(propertyPayload)
          .eq('id', editingProperty.id)

        if (error) throw error

        // Update local state
        setProperties((prev) =>
          prev.map((p) =>
            p.id === editingProperty.id
              ? {
                  ...p,
                  ...propertyPayload,
                  location: locations.find((l) => l.id === locationId) || p.location,
                }
              : p
          )
        )
      } else {
        // Insert new Property
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyPayload)
          .select('*, location:locations(*)')
          .single()

        if (error) {
          // If Supabase table is not configured, simulate local insert for testing
          const newProp: Property = {
            id: `prop-${Date.now()}`,
            ...propertyPayload,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            available_from: new Date().toISOString(),
            latitude: null,
            longitude: null,
            location: locations.find((l) => l.id === locationId),
            images: [],
          }
          setProperties((prev) => [newProp, ...prev])
        } else if (data) {
          setProperties((prev) => [data as Property, ...prev])
        }
      }

      setModalOpen(false)
    } catch (err: any) {
      setFormError(err.message || 'Failed to save property.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await supabase.from('properties').delete().eq('id', propertyId)
      setProperties((prev) => prev.filter((p) => p.id !== propertyId))
      setDeleteConfirmId(null)
    } catch (err) {
      console.error('Delete error:', err)
      setProperties((prev) => prev.filter((p) => p.id !== propertyId))
      setDeleteConfirmId(null)
    }
  }

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building size={22} className="text-amber-400" /> Property Listings CMS
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Add, update, unpublish, and manage photos/video for all Kanpur rentals
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Listing
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, neighborhood, address..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-text-muted focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'AVAILABLE', 'RENTED', 'RESERVED', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'bg-white/5 text-text-muted hover:text-white border border-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table / Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading properties...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="bg-white/[0.03] text-text-muted uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Rent / Mo</th>
                  <th className="px-4 py-3">BHK / Area</th>
                  <th className="px-4 py-3">Tenant Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-text-muted">
                      No matching properties found.
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white truncate max-w-xs">{prop.title}</div>
                        <div className="text-[11px] text-text-muted truncate max-w-xs">{prop.address}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-white text-[11px]">
                          {prop.location?.name || 'Kanpur'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-white">
                        ₹{prop.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {prop.bhk} BHK · {prop.area_sqft} sqft
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {prop.tenant_type}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            prop.status === 'AVAILABLE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : prop.status === 'RENTED'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/rentals/${prop.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                            title="Preview Property"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(prop)}
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                            title="Edit Property"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prop.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#0E0B1F] p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Delete Property Listing?</h3>
            <p className="text-xs text-text-secondary mb-5">
              Are you sure you want to permanently remove this property? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary px-4 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProperty(deleteConfirmId)}
                className="btn btn-primary bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl text-xs text-white"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Property Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl my-8 rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-8 shadow-2xl shadow-purple-950/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingProperty ? 'Edit Property Listing' : 'Create New Property Listing'}
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Configure specs, location foreign key, pricing, images, and video tour
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProperty} className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Property Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Spacious 2BHK Apartment"
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Slug URL *</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="spacious-2bhk-apartment"
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-text-secondary mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed description of property..."
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Pricing & Location */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pricing & Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Maintenance (₹)</label>
                    <input
                      type="number"
                      value={maintenance}
                      onChange={(e) => setMaintenance(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Location / Area *</label>
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Full Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Gurudev Chauraha, Kanpur"
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">BHK *</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={bhk}
                      onChange={(e) => setBhk(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Bathrooms</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Area (sqft) *</label>
                    <input
                      type="number"
                      value={areaSqft}
                      onChange={(e) => setAreaSqft(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Tenant Type</label>
                    <select
                      value={tenantType}
                      onChange={(e) => setTenantType(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Family">Family</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Professional">Professional</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Studio Flat">Studio Flat</option>
                      <option value="Duplex">Duplex</option>
                      <option value="House">Independent House</option>
                      <option value="Builder Floor">Builder Floor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Furnishing</label>
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RENTED">RENTED</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="DRAFT">DRAFT</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Media & Video Tour</h4>
                <div>
                  <label className="block text-xs text-text-secondary mb-1 flex items-center gap-1.5">
                    <Film size={13} className="text-accent-cyan" /> Property Video Tour URL (YouTube or MP4)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or .mp4 URL"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-amber-400"
                    />
                    <span>Mark as Featured Rental on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary px-5 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2"
                >
                  <Check size={15} />
                  {saving ? 'Saving Listing...' : editingProperty ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
