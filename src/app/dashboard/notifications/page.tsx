'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { UserNotification } from '@/types'
import {
  Bell,
  Check,
  Calendar,
  Heart,
  Shield,
  Sparkles,
  Trash2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react'

export default function TenantNotificationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const supabase = createClient()

  const loadNotifications = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        // Table might be newly provisioned; handle gracefully
        console.warn('Notifications fetch notice:', error)
        setNotifications([])
      } else {
        setNotifications((data as UserNotification[]) || [])
      }
    } catch (err: any) {
      console.error('Failed to load notifications:', err)
      setErrorMsg(err.message || 'Error loading notifications.')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadNotifications()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  const markAllRead = async () => {
    if (!user?.id || notifications.length === 0) return
    setActionLoading(true)

    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all notifications read:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const markSingleRead = async (id: string) => {
    if (!user?.id) return
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id)

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  const clearAll = async () => {
    if (!user?.id || notifications.length === 0) return
    if (!confirm('Are you sure you want to clear all notifications?')) return
    setActionLoading(true)

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)

      setNotifications([])
    } catch (err) {
      console.error('Failed to clear notifications:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const deleteSingle = async (id: string) => {
    if (!user?.id) return
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell size={20} className="text-primary" /> Notification Center
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time updates regarding your visit bookings, verification document reviews, and property alerts
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              disabled={actionLoading}
              className="btn btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5"
            >
              <Check size={14} /> Mark All Read
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={actionLoading}
              className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear Notifications"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading notification history...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Bell size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No New Notifications</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            You are all caught up! You will receive updates here when field officers confirm physical visits or when your uploaded documents are verified.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 transition-all ${
                notif.read
                  ? 'bg-[#0E0B1F] border-white/5 opacity-80'
                  : 'bg-gradient-to-r from-[#170E38] to-[#0E0B1F] border-purple-800/40 shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-accent-cyan shrink-0 mt-0.5">
                {notif.type === 'visit' && <Calendar size={18} />}
                {notif.type === 'price' && <Heart size={18} />}
                {notif.type === 'document' && <Shield size={18} />}
                {notif.type === 'application' && <FileText size={18} />}
                {notif.type === 'system' && <Sparkles size={18} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                    <Clock size={11} /> {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => markSingleRead(notif.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                    title="Mark as Read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteSingle(notif.id)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove Notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
