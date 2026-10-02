'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SiteStatistic } from '@/types'
import { mockStatistics } from '@/lib/data/mockData'
import {
  BarChart3,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react'

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<SiteStatistic[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('site_statistics')
        .select('*')
        .order('display_order', { ascending: true })

      if (!error && data && data.length > 0) {
        setStats(data as SiteStatistic[])
      } else {
        setStats(mockStatistics)
      }
    } catch {
      setStats(mockStatistics)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleStatChange = (
    index: number,
    field: keyof SiteStatistic,
    value: any
  ) => {
    const updated = [...stats]
    updated[index] = { ...updated[index], [field]: value }
    setStats(updated)
  }

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMsg(null)
    setSaving(true)

    try {
      for (const stat of stats) {
        await supabase
          .from('site_statistics')
          .upsert({
            stat_key: stat.stat_key,
            label: stat.label,
            value_number: Number(stat.value_number),
            value_suffix: stat.value_suffix || '',
            display_order: stat.display_order,
            is_active: stat.is_active,
            updated_at: new Date().toISOString(),
          })
      }

      setStatusMsg({
        type: 'success',
        text: 'Statistics updated successfully! Live website values will now reflect these numbers.',
      })
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to update statistics.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={22} className="text-amber-400" /> Dynamic Website Statistics
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure the 4 hero statistics displayed across the website with smooth digit animations
          </p>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading statistics...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.stat_key || idx}
                className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Statistic #{idx + 1}
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                    <input
                      type="checkbox"
                      checked={stat.is_active}
                      onChange={(e) =>
                        handleStatChange(idx, 'is_active', e.target.checked)
                      }
                      className="rounded border-white/20 bg-white/5 text-amber-400"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Label Display Text
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">
                      Numeric Value
                    </label>
                    <input
                      type="number"
                      required
                      value={stat.value_number}
                      onChange={(e) =>
                        handleStatChange(idx, 'value_number', Number(e.target.value))
                      }
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-text-secondary mb-1">
                      Suffix (e.g. +, %)
                    </label>
                    <input
                      type="text"
                      value={stat.value_suffix || ''}
                      onChange={(e) =>
                        handleStatChange(idx, 'value_suffix', e.target.value)
                      }
                      placeholder="+"
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md"
            >
              <Save size={15} />
              {saving ? 'Publishing Updates...' : 'Publish Statistics to Live Website'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
