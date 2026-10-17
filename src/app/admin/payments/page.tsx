'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  CreditCard,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react'

export default function AdminPaymentsPage() {
  const { user, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    visitFeesCollected: 0,
    capturedCount: 0,
    refundedCount: 0,
    pendingCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CAPTURED' | 'PENDING' | 'REFUNDED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const loadPayments = async () => {
    setLoading(true)
    setErrorMsg(null)

    try {
      const url = statusFilter === 'ALL'
        ? '/api/admin/payments'
        : `/api/admin/payments?status=${statusFilter}`

      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to retrieve payments.')
        setPayments([])
      } else {
        setPayments(data.payments || [])
        if (data.metrics) {
          setMetrics(data.metrics)
        }
      }
    } catch (err: any) {
      console.error('Failed to load admin payments:', err)
      setErrorMsg(err.message || 'Network error loading payment transactions.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && isAdmin) {
        loadPayments()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, statusFilter])

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (p.order_id && p.order_id.toLowerCase().includes(term)) ||
      (p.payment_id && p.payment_id.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CreditCard size={24} className="text-primary" /> Payment Ledger &amp; Transactions
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time audit of ₹300 visit charges, gateway reconciliations, and brokerage records
          </p>
        </div>

        <button
          onClick={loadPayments}
          disabled={loading}
          className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Real Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0E0B1F]">
          <span className="text-xs font-semibold text-text-muted uppercase">Visit Fees Collected</span>
          <div className="text-2xl font-black text-white mt-1">
            ₹{metrics.visitFeesCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            {metrics.capturedCount} Verified Paid Tours
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#0E0B1F]">
          <span className="text-xs font-semibold text-text-muted uppercase">Pending Settlements</span>
          <div className="text-2xl font-black text-white mt-1">{metrics.pendingCount}</div>
          <span className="text-[11px] text-amber-300 font-medium">Awaiting Confirmation</span>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#0E0B1F]">
          <span className="text-xs font-semibold text-text-muted uppercase">Processed Refunds</span>
          <div className="text-2xl font-black text-white mt-1">{metrics.refundedCount}</div>
          <span className="text-[11px] text-text-secondary font-medium">100% Reconciled</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by order or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-[#0E0B1F] border border-white/10 pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'CAPTURED', 'PENDING', 'REFUNDED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              {filter === 'ALL'
                ? 'All'
                : filter === 'CAPTURED'
                ? 'Captured'
                : filter === 'PENDING'
                ? 'Pending'
                : 'Refunded'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary">
            <thead>
              <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order / Payment ID</th>
                <th className="pb-3 font-semibold">Transaction Details</th>
                <th className="pb-3 font-semibold">Gateway</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    Loading payment records...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <CreditCard size={32} className="text-text-muted mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-white">No Transactions Found</h4>
                    <p className="text-xs text-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
                      Physical visit requests currently default to Pay-on-Physical-Visit (₹300 collected on-site by field agents). Any online payments verified via Razorpay will be tracked here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isCaptured = p.status === 'captured'
                  const isRefunded = p.status === 'refunded'

                  return (
                    <tr key={p.id}>
                      <td className="py-3.5 font-mono text-white font-bold">
                        <div>{p.order_id}</div>
                        {p.payment_id && (
                          <div className="text-[11px] text-text-muted font-normal">{p.payment_id}</div>
                        )}
                      </td>
                      <td className="py-3.5">
                        <strong className="text-white block">
                          {p.property?.title || 'Physical Visit Booking'}
                        </strong>
                        <span className="text-[11px] text-text-muted">
                          {p.description || 'Assisted Property Walkthrough'}
                        </span>
                      </td>
                      <td className="py-3.5 text-accent-cyan font-medium">{p.gateway || 'Razorpay'}</td>
                      <td className="py-3.5 text-white font-bold text-sm">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold border ${
                            isCaptured
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isRefunded
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {p.status?.toUpperCase() || 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
