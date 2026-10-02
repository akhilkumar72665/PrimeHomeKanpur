'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ContactMessage } from '@/types'
import {
  MessageSquare,
  CheckCircle2,
  Clock3,
  Phone,
  Mail,
  Trash2,
  Archive,
  Check,
  Building
} from 'lucide-react'

export default function AdminInquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const supabase = createClient()

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setMessages(data as ContactMessage[])
      } else {
        setMessages([])
      }
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleUpdateStatus = async (
    msgId: string,
    newStatus: ContactMessage['status']
  ) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', msgId)

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
      )
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await supabase.from('contact_messages').delete().eq('id', msgId)
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filtered = messages.filter((m) => filter === 'ALL' || m.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-amber-400" /> Contact Inquiries & Queries
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage inquiries submitted through website forms and property consultation requests
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'new', 'read', 'contacted', 'archived'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              filter === st
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-white/5 text-text-muted hover:text-white border border-white/5'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading inquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white mb-1">No inquiries found</h3>
          <p className="text-xs text-text-muted">
            There are currently no messages matching the filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      msg.status === 'new'
                        ? 'bg-amber-500/20 text-amber-300'
                        : msg.status === 'contacted'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted">
                  {new Date(msg.created_at).toLocaleDateString()} at{' '}
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
                <a
                  href={`mailto:${msg.email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail size={13} className="text-accent-pink" /> {msg.email}
                </a>
                {msg.phone && (
                  <a
                    href={`tel:${msg.phone}`}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Phone size={13} className="text-accent-pink" /> {msg.phone}
                  </a>
                )}
              </div>

              {msg.property && (
                <div className="text-xs text-accent-cyan flex items-center gap-1.5">
                  <Building size={13} />
                  <span>Property Inquiry: {msg.property.title}</span>
                </div>
              )}

              <p className="text-xs text-text-secondary leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                "{msg.message}"
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 size={13} /> Delete
                </button>

                <div className="flex items-center gap-2">
                  {msg.status !== 'contacted' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(msg.id, 'contacted')}
                      className="px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {msg.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(msg.id, 'archived')}
                      className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary border border-white/10 text-xs"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
