'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { AdminProperty, LocationItem, AdminAgent } from '@/types/admin'
import {
  Building,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Eye,
  Video,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { z } from 'zod'

import { mockProperties } from '@/lib/data/mockData'
import { Upload, Film, Play } from 'lucide-react'

const PROPERTY_TYPES = ['Flat', 'House', 'PG', 'Room', 'Shop', 'Office', 'Apartment', 'Duplex']
const TENANT_TYPES = ['Family', 'Bachelor', 'Professional', 'Any']
const FURNISHING_TYPES = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished']
const STATUS_TYPES = ['AVAILABLE', 'RENTED', 'RESERVED', 'DRAFT', 'HIDDEN', 'INACTIVE']
const AMENITIES_LIST = [
  'Car Parking',
  'Lift',
  '24x7 Water Supply',
  'Power Backup',
  'Security Guard',
  'CCTV',
  'Balcony',
  'Gated Community',
  'Modular Kitchen',
  'Air Conditioner',
  'Geyser',
  'Park Facing',
]

const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(500, 'Rent must be at least ₹500/month'),
  security_deposit: z.number().nullable(),
  maintenance: z.number().nullable(),
  property_type: z.string().min(1, 'Property type is required'),
  bhk: z.number().min(1, 'BHK must be at least 1'),
  bathrooms: z.number().min(1, 'Bathrooms must be at least 1'),
  area_sqft: z.number().min(50, 'Area must be at least 50 sqft'),
  floor: z.number().nullable(),
  total_floors: z.number().nullable(),
  tenant_type: z.enum(['Family', 'Bachelor', 'Professional', 'Any']),
  furnishing: z.string().nullable(),
  status: z.enum(['DRAFT', 'AVAILABLE', 'RESERVED', 'RENTED', 'INACTIVE', 'HIDDEN']),
  location_id: z.string().min(1, 'Location is required'),
  address: z.string().min(3, 'Address is required'),
  featured: z.boolean(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  video_url: z.string().nullable(),
  agent_id: z.string().nullable(),
})

export default function AdminPropertiesPage() {
  const { user, can } = useAuth()
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [agents, setAgents] = useState<AdminAgent[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<AdminProperty | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 15000,
    security_deposit: 15000,
    maintenance: 0,
    property_type: 'Flat',
    bhk: 2,
    bathrooms: 1,
    area_sqft: 1000,
    floor: 2,
    total_floors: 4,
    tenant_type: 'Family' as 'Family' | 'Bachelor' | 'Professional' | 'Any',
    furnishing: 'Semi-Furnished',
    status: 'AVAILABLE' as 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE' | 'HIDDEN',
    location_id: '',
    address: '',
    featured: false,
    amenities: [] as string[],
    images: [] as string[],
    video_url: '',
    agent_id: '',
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminProperty | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const supabase = createClient()

  const loadData = async () => {
    try {
      setLoading(true)

      const [{ data: props, error: propsErr }, { data: locs }, { data: ags }] = await Promise.all([
        supabase
          .from('properties')
          .select(`
            *,
            location:locations(id, name, city, slug)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('locations').select('*').eq('is_active', true).order('name', { ascending: true }),
        supabase.from('agents').select('*').eq('is_active', true).order('name', { ascending: true }),
      ])

      if (props && props.length > 0) {
        setProperties(props as AdminProperty[])
      } else {
        // Fallback to existing mock properties catalog
        const fallbackMapped: AdminProperty[] = (mockProperties as any[]).map((mp) => ({
          id: mp.id,
          slug: mp.slug,
          title: mp.title,
          description: mp.description,
          price: mp.price,
          security_deposit: mp.security_deposit || mp.price * 2,
          maintenance: mp.maintenance || Math.round(mp.price * 0.05),
          property_type: mp.property_type || 'Flat',
          bhk: mp.bhk || 2,
          bathrooms: mp.bathrooms || 1,
          area_sqft: mp.area_sqft || 1000,
          floor: mp.floor || 1,
          total_floors: mp.total_floors || 4,
          tenant_type: mp.tenant_type || 'Family',
          furnishing: mp.furnishing || 'Semi-Furnished',
          status: (mp.status || 'AVAILABLE') as any,
          location_id: mp.location?.id || mp.location_id || 'loc-1',
          location: mp.location || { id: 'loc-1', name: 'Gurudev Chauraha', city: 'Kanpur', slug: 'gurudev-chauraha', is_active: true, sort_order: 1, created_at: new Date().toISOString() },
          address: mp.address || `${mp.location?.name || 'Kanpur'}, Kanpur`,
          latitude: null,
          longitude: null,
          featured: !!mp.featured,
          available_from: new Date().toISOString().split('T')[0],
          amenities: mp.amenities || ['24x7 Water Supply', 'Balcony'],
          images: mp.images?.map((im: any) => (typeof im === 'string' ? im : im.url)) || [],
          video_url: mp.video_url || null,
          agent_id: mp.agent_id || null,
          created_at: mp.created_at || new Date().toISOString(),
          updated_at: mp.updated_at || new Date().toISOString(),
        }))
        setProperties(fallbackMapped)
      }

      setLocations((locs as LocationItem[]) || [])
      setAgents((ags as AdminAgent[]) || [])
    } catch (err: unknown) {
      console.error('Error loading properties data:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation: Size <= 50MB
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('Video file must be less than 50MB')
      return
    }

    // Validation: Allowed video MIME types
    const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedMimeTypes.includes(file.type)) {
      setErrorMessage('Invalid video format. Please upload a valid MP4 or WebM video file.')
      return
    }

    setUploadingVideo(true)
    setErrorMessage(null)
    try {
      const rawExt = file.name.split('.').pop()?.toLowerCase() || 'mp4'
      const validExts = ['mp4', 'webm', 'mov']
      const ext = validExts.includes(rawExt) ? rawExt : 'mp4'
      const fileName = `prop_vid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('property-videos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('property-videos')
        .getPublicUrl(fileName)

      setFormData((prev) => ({ ...prev, video_url: publicUrl }))
      setSuccessMessage('Video uploaded successfully!')
    } catch (err: any) {
      setErrorMessage('Video upload failed: ' + (err.message || ''))
    } finally {
      setUploadingVideo(false)
      e.target.value = ''
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus
      const matchType = selectedType === 'ALL' || p.property_type === selectedType
      const matchLoc = selectedLocation === 'ALL' || p.location_id === selectedLocation

      return matchSearch && matchStatus && matchType && matchLoc
    })
  }, [properties, searchQuery, selectedStatus, selectedType, selectedLocation])

  // Pagination calculation
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(start, start + itemsPerPage)
  }, [filteredProperties, currentPage])

  const openCreateModal = () => {
    setEditingProperty(null)
    setFormData({
      title: '',
      description: '',
      price: 15000,
      security_deposit: 15000,
      maintenance: 0,
      property_type: 'Flat',
      bhk: 2,
      bathrooms: 1,
      area_sqft: 1000,
      floor: 2,
      total_floors: 4,
      tenant_type: 'Family',
      furnishing: 'Semi-Furnished',
      status: 'AVAILABLE',
      location_id: locations[0]?.id || '',
      address: '',
      featured: false,
      amenities: ['24x7 Water Supply', 'Balcony'],
      images: [],
      video_url: '',
      agent_id: agents[0]?.id || '',
    })
    setValidationErrors({})
    setModalOpen(true)
  }

  const openEditModal = (p: AdminProperty) => {
    setEditingProperty(p)
    setFormData({
      title: p.title,
      description: p.description,
      price: p.price,
      security_deposit: p.security_deposit || 0,
      maintenance: p.maintenance || 0,
      property_type: p.property_type || 'Flat',
      bhk: p.bhk || 2,
      bathrooms: p.bathrooms || 1,
      area_sqft: p.area_sqft || 1000,
      floor: p.floor || 1,
      total_floors: p.total_floors || 4,
      tenant_type: p.tenant_type || 'Family',
      furnishing: p.furnishing || 'Semi-Furnished',
      status: p.status || 'AVAILABLE',
      location_id: p.location_id || '',
      address: p.address,
      featured: p.featured || false,
      amenities: p.amenities || [],
      images: p.images || [],
      video_url: p.video_url || '',
      agent_id: p.agent_id || '',
    })
    setValidationErrors({})
    setModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors({})

    const validation = propertySchema.safeParse({
      ...formData,
      price: Number(formData.price),
      security_deposit: formData.security_deposit ? Number(formData.security_deposit) : null,
      maintenance: formData.maintenance ? Number(formData.maintenance) : null,
      bhk: Number(formData.bhk),
      bathrooms: Number(formData.bathrooms),
      area_sqft: Number(formData.area_sqft),
      floor: formData.floor ? Number(formData.floor) : null,
      total_floors: formData.total_floors ? Number(formData.total_floors) : null,
      video_url: formData.video_url?.trim() || null,
      agent_id: formData.agent_id || null,
    })

    if (!validation.success) {
      const errMap: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errMap[issue.path[0].toString()] = issue.message
        }
      })
      setValidationErrors(errMap)
      return
    }

    try {
      setSubmitting(true)
      const dataToSave = validation.data

      // Slug generation
      let slug = editingProperty?.slug
      if (!slug || editingProperty?.title !== dataToSave.title) {
        const baseSlug = dataToSave.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
        slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
      }

      if (editingProperty) {
        // Update
        const { error } = await supabase
          .from('properties')
          .update({
            ...dataToSave,
            slug,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProperty.id)

        if (error) throw error

        await supabase.from('activity_logs').insert({
          actor_id: user?.id,
          actor_email: user?.email,
          action: 'UPDATE',
          entity: 'property',
          entity_id: editingProperty.id,
          summary: `Updated property: ${dataToSave.title} (₹${dataToSave.price.toLocaleString()})`,
        })

        setSuccessMessage(`Property "${dataToSave.title}" updated successfully.`)
      } else {
        // Insert
        const { data: newProp, error } = await supabase
          .from('properties')
          .insert({
            ...dataToSave,
            slug,
            created_by: user?.id,
          })
          .select()
          .single()

        if (error) throw error

        await supabase.from('activity_logs').insert({
          actor_id: user?.id,
          actor_email: user?.email,
          action: 'CREATE',
          entity: 'property',
          entity_id: newProp?.id,
          summary: `Created new property: ${dataToSave.title} (₹${dataToSave.price.toLocaleString()})`,
        })

        setSuccessMessage(`Property "${dataToSave.title}" created successfully.`)
      }

      setModalOpen(false)
      loadData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error saving property')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProperty = async () => {
    if (!deleteTarget) return

    try {
      setSubmitting(true)

      // Delete storage files if any
      if (deleteTarget.images && deleteTarget.images.length > 0) {
        const filePaths = deleteTarget.images
          .map((url) => {
            const parts = url.split('/property-images/')
            return parts[1]
          })
          .filter(Boolean) as string[]

        if (filePaths.length > 0) {
          await supabase.storage.from('property-images').remove(filePaths)
        }
      }

      const { error } = await supabase.from('properties').delete().eq('id', deleteTarget.id)
      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'DELETE',
        entity: 'property',
        entity_id: deleteTarget.id,
        summary: `Deleted property: ${deleteTarget.title}`,
      })

      setSuccessMessage(`Deleted property "${deleteTarget.title}".`)
      setDeleteConfirmOpen(false)
      setDeleteTarget(null)
      loadData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete property')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      }
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Rental Properties CMS</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage Kanpur verified rental catalog, upload media, pricing, and live statuses.
          </p>
        </div>

        {can('properties.create') && (
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] text-xs font-bold transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2"
          >
            <Plus size={15} /> Add New Property
          </button>
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

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl border border-white/10 bg-[#0E0A20]">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search properties, area, address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_TYPES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Property Types</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                Type: {pt}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Kanpur Areas</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                Area: {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Properties Table & Cards */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0A20] shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-text-muted">Loading properties catalog...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-16 text-center text-xs text-text-muted">
            No properties found matching your search and filter criteria.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text-secondary">
                <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Property</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Rent (INR)</th>
                    <th className="py-3.5 px-4">Type / BHK</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedProperties.map((prop) => {
                    const coverImg = prop.images?.[0] || '/images/placeholders/property.jpg'
                    return (
                      <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                              <img src={coverImg} alt={prop.title} className="w-full h-full object-cover" />
                              {prop.featured && (
                                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-amber-400 text-[#04121a] flex items-center justify-center shadow">
                                  <Star size={9} className="fill-current" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <span className="font-bold text-white block truncate">{prop.title}</span>
                              <span className="text-[11px] text-text-muted block truncate">{prop.address}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-white font-medium">
                            <MapPin size={12} className="text-primary" />
                            {prop.location?.name || 'Kanpur'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-white font-bold text-sm">
                            ₹{prop.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-text-muted block">/ month</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-white font-medium">{prop.bhk} BHK</span>
                          <span className="text-[11px] text-text-muted block">{prop.property_type}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={prop.status} />
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/rentals/${prop.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                              title="View on Public Site"
                            >
                              <ExternalLink size={14} />
                            </a>

                            {can('properties.update') && (
                              <button
                                type="button"
                                onClick={() => openEditModal(prop)}
                                className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                title="Edit Property"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}

                            {can('properties.delete') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteTarget(prop)
                                  setDeleteConfirmOpen(true)
                                }}
                                className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete Property"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-white/5 bg-white/[0.01]">
              <span className="text-xs text-text-muted">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProperties.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredProperties.length)} of {filteredProperties.length} properties
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg text-text-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="px-3 py-1 text-xs font-semibold text-white">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg text-text-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Create / Edit Full Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0E0A20] p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingProperty ? 'Edit Property Listing' : 'Add New Property Listing'}
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Fill in the verified listing details for the Kanpur rental catalog.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Media Section: Image Uploader */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                  Property Photos (Up to 10 images)
                </label>
                <ImageUploader
                  images={formData.images}
                  onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
                  maxImages={10}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Spacious 2BHK Apartment near Kakadeo Coaching Hub"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                  {validationErrors.title && (
                    <p className="text-[11px] text-rose-400 mt-1">{validationErrors.title}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Highlight key features, landlord preferences, ventilation, and nearby landmarks..."
                    className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                  {validationErrors.description && (
                    <p className="text-[11px] text-rose-400 mt-1">{validationErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Monthly Rent (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Security Deposit (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.security_deposit}
                    onChange={(e) => setFormData({ ...formData, security_deposit: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Kanpur Location Area *
                  </label>
                  <select
                    required
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Select location...</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.city})
                      </option>
                    ))}
                  </select>
                  {validationErrors.location_id && (
                    <p className="text-[11px] text-rose-400 mt-1">{validationErrors.location_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Plot No., Street, Landmark..."
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Property Type
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Bedrooms (BHK)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={formData.area_sqft}
                    onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Tenant Preference
                  </label>
                  <select
                    value={formData.tenant_type}
                    onChange={(e) => setFormData({ ...formData, tenant_type: e.target.value as any })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    {TENANT_TYPES.map((tt) => (
                      <option key={tt} value={tt}>
                        {tt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Furnishing Status
                  </label>
                  <select
                    value={formData.furnishing || 'Semi-Furnished'}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    {FURNISHING_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Catalog Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    {STATUS_TYPES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Assigned Agent / Manager
                  </label>
                  <select
                    value={formData.agent_id}
                    onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">None / Direct Office</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Property Video Walkthrough (Upload MP4/WebM or YouTube URL)
                  </label>

                  {/* Video Preview if present */}
                  {formData.video_url && (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 p-2 mb-3">
                      {formData.video_url.includes('youtube.com') || formData.video_url.includes('youtu.be') ? (
                        <div className="flex items-center gap-2 p-3 text-xs text-amber-300">
                          <Film size={18} className="text-amber-400 shrink-0" />
                          <span className="truncate">YouTube Video: {formData.video_url}</span>
                        </div>
                      ) : (
                        <video
                          src={formData.video_url}
                          controls
                          className="w-full max-h-48 rounded-xl object-contain bg-black"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, video_url: '' })}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-white text-xs transition-colors flex items-center gap-1 shadow"
                      >
                        <X size={14} /> Remove Video
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* File Upload Button */}
                    <label className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-dashed border-white/20 hover:border-primary/50 text-white text-xs font-semibold cursor-pointer transition-all">
                      <Upload size={16} className="text-primary" />
                      <span>{uploadingVideo ? 'Uploading (≤50MB)...' : 'Upload Video File (≤50MB)'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>

                    {/* URL Input */}
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                        <Film size={16} />
                      </div>
                      <input
                        type="url"
                        value={formData.video_url || ''}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="Or paste YouTube / video URL"
                        style={{ paddingLeft: '2.5rem' }}
                        className="w-full h-11 pr-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Amenities &amp; Facilities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {AMENITIES_LIST.map((am) => {
                    const active = formData.amenities.includes(am)
                    return (
                      <button
                        type="button"
                        key={am}
                        onClick={() => toggleAmenity(am)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                          active
                            ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                            : 'bg-white/[0.02] border-white/10 text-text-secondary hover:text-white'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {am}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="pt-2 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white">Mark as Featured Property</span>
                    <p className="text-xs text-text-muted">Shows in top featured carousel on homepage and rentals page.</p>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] font-bold text-xs shadow-lg shadow-cyan-950/40 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving Property...' : editingProperty ? 'Update Property' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title={`Delete "${deleteTarget?.title}"?`}
        description="Are you sure you want to delete this listing? Photos uploaded for this property will also be removed from storage."
        confirmText="Delete Listing"
        isLoading={submitting}
        onConfirm={handleDeleteProperty}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}
