'use client'

import React, { useState } from 'react'
import { Bell, Check, Calendar, Heart, Shield, Sparkles, Trash2 } from 'lucide-react'

export default function TenantNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Visit Confirmed for Kakadeo 2BHK',
      message: 'Your walkthrough appointment with Abhishek Pathak is scheduled for Tomorrow at 11:00 AM.',
      time: '2 hours ago',
      type: 'visit',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Price Reduction in Swaroop Nagar',
      message: 'A property on your saved wishlist dropped from ₹25,000/mo to ₹23,500/mo.',
      time: '1 day ago',
      type: 'price',
      read: true,
    },
    {
      id: 'notif-3',
      title: 'Welcome to PrimeHomeKanpur',
      message: 'Your account is ready! You can now book ₹300 assisted visits and save favorite Kanpur rentals.',
      time: '3 days ago',
      type: 'system',
      read: true,
    },
  ])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell size={20} className="text-primary" /> Notification Center
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time updates regarding your visit bookings, wishlist price drops, and property status
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="btn btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5"
            >
              <Check size={14} /> Mark All Read
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear Notifications"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Bell size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No New Notifications</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            You are all caught up! You will receive alerts when agents confirm visits or when landlords update property status.
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
                {notif.type === 'system' && <Sparkles size={18} />}
              </div>

              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                  <span className="text-[11px] text-text-muted shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
