'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TeamMember } from '@/types'
import { mockAgents } from '@/lib/data/mockData'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Shield,
  X,
  Check,
  AlertCircle
} from 'lucide-react'

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [designation, setDesignation] = useState('')
  const [phone, setPhone] = useState('+91 9151435647')
  const [email, setEmail] = useState('primehomekanpur@gmail.com')
  const [whatsapp, setWhatsapp] = useState('+91 9151435647')
  const [bio, setBio] = useState('')
  const [role, setRole] = useState('agent')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const supabase = createClient()

  const loadTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })

      if (!error && data && data.length > 0) {
        setTeam(data as TeamMember[])
      } else {
        setTeam(mockAgents as TeamMember[])
      }
    } catch {
      setTeam(mockAgents as TeamMember[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  const openAddModal = () => {
    setEditingMember(null)
    setName('')
    setSlug('')
    setDesignation('')
    setPhone('+91 9151435647')
    setEmail('primehomekanpur@gmail.com')
    setWhatsapp('+91 9151435647')
    setBio('')
    setRole('agent')
    setIsActive(true)
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member)
    setName(member.name)
    setSlug(member.slug)
    setDesignation(member.designation)
    setPhone(member.phone)
    setEmail(member.email)
    setWhatsapp(member.whatsapp || member.phone)
    setBio(member.bio || '')
    setRole(member.role)
    setIsActive(member.is_active)
    setFormError(null)
    setModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingMember) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      )
    }
  }

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name || !designation || !phone) {
      setFormError('Please fill in required fields (Name, Designation, Phone).')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        designation,
        phone,
        email: email || 'primehomekanpur@gmail.com',
        whatsapp: whatsapp || phone,
        bio: bio || null,
        role,
        is_active: isActive,
      }

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingMember.id)

        if (error) throw error

        setTeam((prev) =>
          prev.map((m) => (m.id === editingMember.id ? { ...m, ...payload } : m))
        )
      } else {
        const { data, error } = await supabase
          .from('team_members')
          .insert(payload)
          .select('*')
          .single()

        if (error) {
          const newMember: TeamMember = {
            id: `tm-${Date.now()}`,
            ...payload,
            profile_photo: null,
            display_order: team.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setTeam((prev) => [...prev, newMember])
        } else if (data) {
          setTeam((prev) => [...prev, data as TeamMember])
        }
      }

      setModalOpen(false)
    } catch (err: any) {
      setFormError(err.message || 'Failed to save team member.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return
    try {
      await supabase.from('team_members').delete().eq('id', id)
      setTeam((prev) => prev.filter((m) => m.id !== id))
    } catch {
      setTeam((prev) => prev.filter((m) => m.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-amber-400" /> Team & Agents Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage company leadership, listing executives, designations, and contact numbers
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md self-start sm:self-auto"
        >
          <Plus size={15} /> Add Team Member
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading team roster...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 flex flex-col justify-between hover:border-amber-400/30 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white font-extrabold text-base shadow-md">
                    {member.name.charAt(0)}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      member.is_active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{member.name}</h3>
                <p className="text-xs text-accent-cyan font-semibold mt-0.5">
                  {member.designation}
                </p>

                <p className="text-xs text-text-secondary mt-3 line-clamp-3 leading-relaxed">
                  {member.bio || 'PrimeHomeKanpur real estate professional.'}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-accent-pink" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-accent-pink" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                  title="Edit Member"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove Member"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <p className="text-xs text-text-secondary mb-5">
              Configure name, role, contact phone, and public profile
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Abhishek Pathak"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Founder & CEO"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9151435647"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="primehomekanpur@gmail.com"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">Short Bio / Description</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Experience in Kanpur rentals, area specializations..."
                  className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="property_manager">Property Manager</option>
                    <option value="listing_manager">Listing Manager</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-amber-400"
                    />
                    <span>Active Profile</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  {saving ? 'Saving...' : editingMember ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
