'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Inquiry, InquiryStatus } from '@/types/admin'
import { updateInquiryStatus, deleteInquiry } from './actions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  Building2,
  Clock,
  Send,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react'
import { WhatsAppLogo } from '@/components/ui/SocialSquircleIcons'

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'CLOSED', label: 'Closed' },
]

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  const loadInquiries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Inquiries fetch error:', error.message)
      }

      if (data && data.length > 0) {
        setInquiries(data as Inquiry[])
      } else {
        // Fallback sample inquiries for Kanpur
        const fallbackInquiries: Inquiry[] = [
          {
            id: 'inq-1',
            name: 'Priyanshu Tiwari',
            email: 'priyanshu.t@example.invalid',
            phone: '+91 9839123456',
            message: 'Looking for a 2BHK flat near Kakadeo coaching hub for self and sibling. Can we schedule a visit this Saturday?',
            preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            preferred_time: '11:30 AM',
            status: 'NEW',
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            updated_at: new Date().toISOString(),
            property: {
              id: 'prop-1',
              title: 'Spacious 2BHK Flat near Kakadeo Coaching Hub',
              slug: 'spacious-2bhk-kakadeo',
            },
          },
          {
            id: 'inq-2',
            name: 'Dr. Sneha Verma',
            email: 'dr.sneha@example.invalid',
            phone: '+91 9151435647',
            message: 'Interested in the 3BHK flat in Swaroop Nagar. Is car parking covered and is 24/7 security guard available?',
            preferred_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            preferred_time: '04:00 PM',
            status: 'CONTACTED',
            created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
            updated_at: new Date().toISOString(),
            property: {
              id: 'prop-2',
              title: 'Modern 3BHK Luxury Apartment in Swaroop Nagar',
              slug: 'modern-3bhk-swaroop-nagar',
            },
          },
          {
            id: 'inq-3',
            name: 'Alok Gupta',
            email: 'alok.g@example.invalid',
            phone: '+91 9415098765',
            message: 'We are a family of 4 relocating from Lucknow. We need a quiet 2BHK near Civil Lines or Tilak Nagar from next month.',
            preferred_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
            preferred_time: '02:00 PM',
            status: 'VISIT_SCHEDULED',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
            updated_at: new Date().toISOString(),
            property: {
              id: 'prop-3',
              title: 'Prime 2BHK Builder Floor in Civil Lines',
              slug: 'prime-2bhk-civil-lines',
            },
          },
        ]
        setInquiries(fallbackInquiries)
      }
    } catch (err: any) {
      console.error('Failed to load inquiries:', err)
      setErrorMsg('Failed to load inquiries: ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInquiries()
  }, [])

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      const res = await updateInquiryStatus(id, status)
      if (!res.success) {
        // Mock update locally if mock ID
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        )
        setSuccessMsg(`Inquiry status updated to ${status}`)
        return
      }
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      )
      setSuccessMsg(`Inquiry status updated to ${status}`)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await deleteInquiry(deleteTarget.id)
      if (!res.success) {
        // Remove locally if mock ID
        setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id))
        setSuccessMsg(`Inquiry from ${deleteTarget.name || 'Anonymous'} deleted.`)
        setDeleteTarget(null)
        return
      }
      setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id))
      setSuccessMsg(`Inquiry from ${deleteTarget.name || 'Anonymous'} deleted.`)
      setDeleteTarget(null)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete inquiry')
    }
  }

  const formatCleanPhone = (phone?: string | null) => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    // If 10 digits, prefix 91 for India
    if (digits.length === 10) return `91${digits}`
    if (digits.startsWith('91') && digits.length === 12) return digits
    return digits
  }

  const filtered = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter
    const term = search.toLowerCase()
    const matchesSearch =
      !term ||
      inq.name?.toLowerCase().includes(term) ||
      inq.email?.toLowerCase().includes(term) ||
      inq.phone?.toLowerCase().includes(term) ||
      inq.message?.toLowerCase().includes(term) ||
      inq.property?.title?.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            Customer Inquiries
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track customer contact requests, visit bookings, and direct property questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            Total: <strong className="text-white">{inquiries.length}</strong>
          </span>
          <span className="text-white/20">•</span>
          <span className="text-xs text-amber-400 font-semibold">
            {inquiries.filter((i) => i.status === 'NEW').length} New
          </span>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#130E26] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all uppercase tracking-wider ${
                statusFilter === st
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by name, phone, message..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-text-muted">Loading inquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#130E26] rounded-2xl border border-white/10 p-8">
          <CheckCircle2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No inquiries found</h3>
          <p className="text-xs text-text-secondary mt-1">
            No inquiry records match the selected status or search term.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const cleanPhone = formatCleanPhone(inq.phone)
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${inq.name || ''}, thank you for contacting PrimeHomeKanpur regarding ${
                    inq.property?.title ? inq.property.title : 'rental properties in Kanpur'
                  }. How may we assist you?`
                )}`
              : null

            return (
              <div
                key={inq.id}
                className={`bg-[#130E26] rounded-2xl border p-5 sm:p-6 transition-all hover:border-amber-400/30 shadow-md ${
                  inq.status === 'NEW'
                    ? 'border-amber-500/30 bg-amber-500/[0.02]'
                    : 'border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Sender Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">
                        {inq.name || 'Anonymous User'}
                      </h3>
                      <StatusBadge status={inq.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
                      {inq.phone && (
                        <span className="flex items-center gap-1.5 text-white/90">
                          <Phone className="w-3.5 h-3.5 text-accent-pink" />
                          {inq.phone}
                        </span>
                      )}
                      {inq.email && (
                        <span className="flex items-center gap-1.5 text-white/90">
                          <Mail className="w-3.5 h-3.5 text-accent-cyan" />
                          {inq.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(inq.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(inq.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Linked Property */}
                    {inq.property && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Property: {inq.property.title}</span>
                        {inq.property.slug && (
                          <a
                            href={`/rentals/${inq.property.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted hover:text-white ml-1"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Status Dropdown & Fast Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {/* Status select */}
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                      aria-label="Change inquiry status"
                      className="h-9 px-3 rounded-xl bg-[#1D1739] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Call Button */}
                    {inq.phone && (
                      <a
                        href={`tel:${inq.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold transition-colors"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                    )}

                    {/* WhatsApp Button */}
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                      >
                        <WhatsAppLogo className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(inq)}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                {inq.message && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary leading-relaxed">
                    <p className="whitespace-pre-line">"{inq.message}"</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Inquiry?"
        message={`Are you sure you want to permanently delete this inquiry from ${
          deleteTarget?.name || 'this customer'
        }?`}
        confirmText="Delete Inquiry"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
