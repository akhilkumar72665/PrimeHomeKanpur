'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ActivityLog } from '@/types/admin'
import { StatusBadge } from '@/components/admin/StatusBadge'
import {
  History,
  Search,
  Filter,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  RefreshCw,
  Calendar
} from 'lucide-react'

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('ALL')
  const [entityFilter, setEntityFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const PAGE_SIZE = 20
  const supabase = createClient()

  const loadLogs = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (actionFilter !== 'ALL') {
        query = query.eq('action', actionFilter)
      }
      if (entityFilter !== 'ALL') {
        query = query.eq('entity', entityFilter)
      }
      if (search.trim()) {
        query = query.or(
          `summary.ilike.%${search}%,actor_email.ilike.%${search}%,entity_id.ilike.%${search}%`
        )
      }

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setLogs(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      console.error('Failed to load activity logs:', err)
      setErrorMsg('Failed to load activity log: ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [actionFilter, entityFilter, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadLogs()
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" />
            System Audit & Activity Logs
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Immutable record of all administrative operations, listings changes, and security events
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLogs()}
          className="btn btn-secondary inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#130E26] p-4 rounded-2xl border border-white/10">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by summary, email, entity ID..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by action"
            className="h-9 px-3 rounded-xl bg-[#1D1739] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="REJECT">REJECT</option>
            <option value="ROLE_CHANGE">ROLE_CHANGE</option>
            <option value="INVITE">INVITE</option>
            <option value="LOGIN">LOGIN</option>
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by entity"
            className="h-9 px-3 rounded-xl bg-[#1D1739] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Entities</option>
            <option value="property">Property</option>
            <option value="location">Location</option>
            <option value="review">Review</option>
            <option value="team_member">Team Member</option>
            <option value="agent">Agent</option>
            <option value="inquiry">Inquiry</option>
            <option value="page_settings">Page Settings</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-text-muted">Loading audit entries...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-[#130E26] rounded-2xl border border-white/10 p-8">
          <History className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No activity logs recorded</h3>
          <p className="text-xs text-text-secondary mt-1">
            Activity logs will appear here whenever changes are made in the admin panel.
          </p>
        </div>
      ) : (
        <div className="bg-[#130E26] rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-white font-semibold">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Summary</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => {
                  const isExpanded = expandedId === log.id

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          isExpanded ? 'bg-white/[0.03]' : ''
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      >
                        {/* Timestamp */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {new Date(log.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}{' '}
                              {new Date(log.created_at).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Actor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-white font-medium">
                            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{log.actor_email || 'System'}</span>
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={log.action} />
                        </td>

                        {/* Entity */}
                        <td className="py-3.5 px-4">
                          <span className="capitalize font-medium text-accent-cyan">
                            {log.entity}
                          </span>
                        </td>

                        {/* Summary */}
                        <td className="py-3.5 px-4">
                          <p className="text-white/90 line-clamp-1 max-w-md">{log.summary}</p>
                        </td>

                        {/* Expand button */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className="p-1 rounded-lg text-text-muted hover:text-white"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable JSON details */}
                      {isExpanded && (
                        <tr className="bg-black/40">
                          <td colSpan={6} className="p-4">
                            <div className="rounded-xl bg-[#090715] p-4 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-2">
                              <div className="flex items-center justify-between text-text-muted border-b border-white/5 pb-2">
                                <span>Entity ID: {log.entity_id || 'N/A'}</span>
                                <span>Actor ID: {log.actor_id || 'N/A'}</span>
                              </div>
                              <pre className="overflow-x-auto text-amber-200/90 whitespace-pre-wrap">
                                {JSON.stringify(log.details || {}, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-text-secondary">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of{' '}
                {totalCount} events
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2 text-white font-semibold">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
