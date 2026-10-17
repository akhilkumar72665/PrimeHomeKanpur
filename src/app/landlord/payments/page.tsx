'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

export default function LandlordPaymentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const loadTransactions = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      // Query transactions where user is payer or receiver
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Payment transactions notice:', error)
        setTransactions([])
      } else {
        setTransactions(data || [])
      }
    } catch (err: any) {
      console.error('Landlord transactions error:', err)
      setErrorMsg(err.message || 'Error loading transaction ledger.')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadTransactions()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard size={20} className="text-primary" /> Brokerage &amp; Financial Ledger
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Transparent transaction records and standard 15-day brokerage invoices
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Brokerage Model Box */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 space-y-3">
        <div className="flex items-center gap-2 text-accent-cyan">
          <ShieldCheck size={18} />
          <h3 className="text-base font-bold text-white">PrimeHome Transparent Pricing Guarantee</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary pt-2">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">Listing &amp; Photography</strong>
            100% Free · No upfront listing or inspection fee.
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">Standard Brokerage</strong>
            15 Days Rent upon successful lease execution only.
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">Lease Drafting</strong>
            Free standard 11-month legal agreement included.
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6">
        <h3 className="text-base font-bold text-white mb-4">Transaction History</h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-text-muted">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="py-10 text-center">
            <CreditCard size={32} className="text-text-muted mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No Invoices or Transactions Yet</h4>
            <p className="text-xs text-text-secondary max-w-sm mx-auto mt-1 leading-relaxed">
              No brokerage is charged until a tenant moves into your property. Invoices will automatically appear here upon lease completion.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead>
                <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3.5 font-mono text-white">{tx.order_id || tx.id.substring(0, 8)}</td>
                    <td className="py-3.5">{tx.description || 'Rental Brokerage Settlement'}</td>
                    <td className="py-3.5 text-white font-bold">₹{tx.amount ? (tx.amount / 100).toLocaleString() : '0'}</td>
                    <td className="py-3.5">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
