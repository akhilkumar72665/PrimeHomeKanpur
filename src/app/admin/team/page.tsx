'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TeamMember } from '@/types/admin'
import { TeamRole, ROLE_PERMISSIONS, PERMISSION_DESCRIPTIONS } from '@/lib/permissions'
import { addTeamMember, updateTeamMember, removeTeamMember } from './actions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Shield,
  Upload,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react'

const ROLES: { role: TeamRole; title: string; desc: string; color: string }[] = [
  {
    role: 'OWNER',
    title: 'Owner',
    desc: 'Full administrative access across everything: system settings, team management, permissions, and database operations.',
    color: 'border-amber-500/30 text-amber-300 bg-amber-500/10'
  },
  {
    role: 'MANAGER',
    title: 'Manager',
    desc: 'Can manage listings, locations, agents, inquiries, reviews, and view user records and audit trails.',
    color: 'border-purple-500/30 text-purple-300 bg-purple-500/10'
  },
  {
    role: 'EDITOR',
    title: 'Editor',
    desc: 'Can create and edit rental listings and properties. Cannot delete properties or change settings.',
    color: 'border-blue-500/30 text-blue-300 bg-blue-500/10'
  },
  {
    role: 'SUPPORT',
    title: 'Support',
    desc: 'Can manage customer inquiries, moderate reviews, and respond to incoming requests.',
    color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
  }
]

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null)

  // Form State
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [designation, setDesignation] = useState('')
  const [teamRole, setTeamRole] = useState<TeamRole>('EDITOR')
  const [isActive, setIsActive] = useState(true)
  const [photoUrl, setPhotoUrl] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const supabase = createClient()

  const loadMembers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (err: any) {
      console.error('Failed to load team members:', err)
      setErrorMsg('Failed to load team members: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleOpenAdd = () => {
    setEditingMember(null)
    setEmail('')
    setName('')
    setPhone('')
    setDesignation('')
    setTeamRole('EDITOR')
    setIsActive(true)
    setPhotoUrl('')
    setErrorMsg(null)
    setSuccessMsg(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m)
    setEmail(m.email)
    setName(m.name || '')
    setPhone(m.phone || '')
    setDesignation(m.designation || '')
    setTeamRole(m.team_role)
    setIsActive(m.is_active)
    setPhotoUrl(m.photo_url || '')
    setErrorMsg(null)
    setSuccessMsg(null)
    setModalOpen(true)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Photo must be less than 5MB')
      return
    }

    setUploadingPhoto(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `team_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('team-photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('team-photos')
        .getPublicUrl(fileName)

      setPhotoUrl(publicUrl)
    } catch (err: any) {
      setErrorMsg('Photo upload failed: ' + (err.message || ''))
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSaving(true)

    try {
      if (editingMember) {
        const res = await updateTeamMember(editingMember.id, {
          name: name.trim(),
          phone: phone.trim() || undefined,
          designation: designation.trim() || undefined,
          team_role: teamRole,
          photo_url: photoUrl || undefined,
          is_active: isActive,
        })
        if (res.success) {
          setSuccessMsg('Team member updated successfully!')
          setModalOpen(false)
          loadMembers()
        }
      } else {
        const res = await addTeamMember({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          phone: phone.trim() || undefined,
          designation: designation.trim() || undefined,
          team_role: teamRole,
          photo_url: photoUrl || undefined,
          is_active: isActive,
        })
        if (res.success) {
          setSuccessMsg('Team member added and invitation sent!')
          setModalOpen(false)
          loadMembers()
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await removeTeamMember(deleteTarget.id)
      setSuccessMsg(`Team member ${deleteTarget.email} removed.`)
      setDeleteTarget(null)
      loadMembers()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove member')
    }
  }

  const selectedRoleMeta = ROLES.find((r) => r.role === teamRole)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              Team & Roles Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              OWNER ONLY
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Manage administrative personnel, assign granular permission tiers, and send access invites
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md self-start sm:self-auto"
        >
          <Plus size={16} /> Add Team Member
        </button>
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

      {/* Team Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-text-muted">Loading team roster...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 bg-[#130E26] rounded-2xl border border-white/10 p-8">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No team members found</h3>
          <p className="text-xs text-text-secondary mt-1 mb-4">
            Invite your first staff member to start collaborating
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary text-xs px-4 py-2 rounded-xl">
            Add Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-[#130E26] rounded-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-amber-400/30 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Top: Avatar & Role Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name || member.email}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-amber-300 font-bold text-lg">
                        {(member.name || member.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {member.name || 'Unnamed Member'}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {member.designation || 'Staff Member'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={member.team_role} />
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        member.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}
                    >
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate text-white/90">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Added {new Date(member.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  {member.user_id ? 'Linked to Account' : 'Invite Pending'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                    title="Edit Member"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(member)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Matrix Reference Table */}
      <div className="bg-[#130E26] rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-cyan" />
              Role Permissions Matrix (Single Source of Truth)
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Enforced at the Database RLS, Middleware, and Server Action levels
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white font-semibold">
                <th className="py-3 px-4">Permission</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center text-amber-400">OWNER</th>
                <th className="py-3 px-4 text-center text-purple-400">MANAGER</th>
                <th className="py-3 px-4 text-center text-blue-400">EDITOR</th>
                <th className="py-3 px-4 text-center text-emerald-400">SUPPORT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(PERMISSION_DESCRIPTIONS).map(([perm, desc]) => {
                const ownerHas = ROLE_PERMISSIONS.OWNER.includes(perm as any)
                const managerHas = ROLE_PERMISSIONS.MANAGER.includes(perm as any)
                const editorHas = ROLE_PERMISSIONS.EDITOR.includes(perm as any)
                const supportHas = ROLE_PERMISSIONS.SUPPORT.includes(perm as any)

                return (
                  <tr key={perm} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-white/90">{perm}</td>
                    <td className="py-2.5 px-4">{desc}</td>
                    <td className="py-2.5 px-4 text-center">
                      {ownerHas ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/40 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {managerHas ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/40 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {editorHas ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/40 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {supportHas ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/40 mx-auto" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              {editingMember ? 'Edit Team Member' : 'Invite New Team Member'}
            </h2>
            <p className="text-xs text-text-secondary mb-5">
              {editingMember
                ? 'Update contact details, role assignment, and active status'
                : 'An email invitation with administrative access will be sent'}
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingMember}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                  {editingMember && (
                    <p className="text-[10px] text-text-muted mt-1">Email cannot be changed after creation</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9151435647"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Operations Head / Property Manager"
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {photoUrl ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white/80 hover:text-white"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-text-muted shrink-0">
                      <Users size={20} />
                    </div>
                  )}

                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors">
                    <Upload size={14} />
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2">
                  System Role Tier *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setTeamRole(r.role)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        teamRole === r.role
                          ? `${r.color} shadow-lg ring-1 ring-amber-400/50`
                          : 'border-white/10 bg-white/[0.02] text-text-secondary hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{r.title}</span>
                        {teamRole === r.role && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-text-muted mt-1 leading-snug line-clamp-2">
                        {r.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Selected Role Permissions Summary */}
                {selectedRoleMeta && (
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-text-secondary flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-semibold">{selectedRoleMeta.title} permissions: </span>
                      {ROLE_PERMISSIONS[teamRole].join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-amber-400 focus:ring-0 w-4 h-4"
                  />
                  <span>Active Account (can log into Admin Panel)</span>
                </label>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingPhoto}
                  className="btn btn-primary px-5 py-2 rounded-xl text-xs font-semibold shadow-md"
                >
                  {saving ? 'Processing...' : editingMember ? 'Update Member' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Team Member?"
        message={`Are you sure you want to revoke admin access and remove ${deleteTarget?.name || deleteTarget?.email} (${deleteTarget?.email})? Their user profile will be reverted to TENANT.`}
        confirmText="Remove Member"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
