'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { TeamRole } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'

async function getCallerOwnerSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized: Not logged in')

  // Check role in team_members
  const { data: member } = await supabase
    .from('team_members')
    .select('team_role, is_active')
    .eq('user_id', user.id)
    .single()

  if (!member || !member.is_active || member.team_role !== 'OWNER') {
    throw new Error('Forbidden: Only OWNER can manage team members')
  }

  return { user, member }
}

export async function addTeamMember(payload: {
  email: string
  name: string
  phone?: string
  designation?: string
  team_role: TeamRole
  photo_url?: string
  is_active?: boolean
}) {
  const { user } = await getCallerOwnerSession()
  const adminClient = createAdminClient()
  const email = payload.email.trim().toLowerCase()

  if (!email) throw new Error('Email is required')

  // Check if team member already exists
  const { data: existing } = await adminClient
    .from('team_members')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    throw new Error('A team member with this email already exists')
  }

  // Check if user already exists in auth.users
  const { data: userList } = await adminClient.auth.admin.listUsers()
  const matchedAuthUser = userList?.users?.find(
    (u) => u.email?.toLowerCase() === email
  )

  let assignedUserId: string | null = null

  if (matchedAuthUser) {
    assignedUserId = matchedAuthUser.id
  } else {
    // Send invite
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const { data: inviteData, error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      { redirectTo: `${siteUrl}/auth/callback` }
    )
    if (inviteErr) {
      console.warn('Invite email warning:', inviteErr.message)
    }
    if (inviteData?.user) {
      assignedUserId = inviteData.user.id
    }
  }

  // Insert into team_members
  const { data: newMember, error: insertErr } = await adminClient
    .from('team_members')
    .insert({
      email,
      name: payload.name.trim(),
      phone: payload.phone?.trim() || null,
      designation: payload.designation?.trim() || null,
      team_role: payload.team_role,
      photo_url: payload.photo_url || null,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
      user_id: assignedUserId,
      invited_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (insertErr) {
    throw new Error(`Failed to create team member: ${insertErr.message}`)
  }

  // If user exists, sync profile to ADMIN
  if (assignedUserId) {
    await adminClient
      .from('profiles')
      .upsert({
        id: assignedUserId,
        email,
        full_name: payload.name,
        role: 'ADMIN',
        updated_at: new Date().toISOString(),
      })
  }

  await logActivity({
    action: 'INVITE',
    entity: 'team_member',
    entityId: newMember.id,
    summary: `Added team member ${payload.name} (${email}) as ${payload.team_role}`,
    details: { email, role: payload.team_role, addedBy: user.email },
  })

  revalidatePath('/admin/team')
  return { success: true, member: newMember }
}

export async function updateTeamMember(
  id: string,
  payload: {
    name?: string
    phone?: string
    designation?: string
    team_role?: TeamRole
    photo_url?: string
    is_active?: boolean
  }
) {
  const { user } = await getCallerOwnerSession()
  const adminClient = createAdminClient()

  // Fetch current member
  const { data: current, error: fetchErr } = await adminClient
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !current) throw new Error('Team member not found')

  // Check self-demote / self-deactivate
  if (current.user_id === user.id) {
    if (payload.team_role && payload.team_role !== 'OWNER') {
      throw new Error('You cannot change your own role from OWNER')
    }
    if (payload.is_active === false) {
      throw new Error('You cannot deactivate your own account')
    }
  }

  // Check remaining owners
  if (
    current.team_role === 'OWNER' &&
    ((payload.team_role && payload.team_role !== 'OWNER') || payload.is_active === false)
  ) {
    const { count } = await adminClient
      .from('team_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_role', 'OWNER')
      .eq('is_active', true)

    if ((count ?? 0) <= 1) {
      throw new Error('Cannot demote/deactivate the last active OWNER')
    }
  }

  const { data: updated, error: updateErr } = await adminClient
    .from('team_members')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (updateErr) throw new Error(`Failed to update team member: ${updateErr.message}`)

  // Sync profile role if active status changed
  if (current.user_id) {
    if (payload.is_active === false) {
      await adminClient.from('profiles').update({ role: 'TENANT' }).eq('id', current.user_id)
    } else if (payload.is_active === true) {
      await adminClient.from('profiles').update({ role: 'ADMIN' }).eq('id', current.user_id)
    }
  }

  await logActivity({
    action: 'UPDATE',
    entity: 'team_member',
    entityId: id,
    summary: `Updated team member ${updated.name || updated.email}`,
    details: { changes: payload, updatedBy: user.email },
  })

  revalidatePath('/admin/team')
  return { success: true, member: updated }
}

export async function removeTeamMember(id: string) {
  const { user } = await getCallerOwnerSession()
  const adminClient = createAdminClient()

  // Fetch current member
  const { data: current, error: fetchErr } = await adminClient
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !current) throw new Error('Team member not found')

  if (current.user_id === user.id) {
    throw new Error('You cannot remove your own team membership')
  }

  if (current.team_role === 'OWNER') {
    const { count } = await adminClient
      .from('team_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_role', 'OWNER')
      .eq('is_active', true)

    if ((count ?? 0) <= 1) {
      throw new Error('Cannot remove the last active OWNER')
    }
  }

  // Delete team member
  const { error: delErr } = await adminClient
    .from('team_members')
    .delete()
    .eq('id', id)

  if (delErr) throw new Error(`Failed to remove team member: ${delErr.message}`)

  // Revert profile to TENANT
  if (current.user_id) {
    await adminClient
      .from('profiles')
      .update({ role: 'TENANT' })
      .eq('id', current.user_id)
  }

  await logActivity({
    action: 'DELETE',
    entity: 'team_member',
    entityId: id,
    summary: `Removed team member ${current.name || current.email} (${current.email})`,
    details: { removedEmail: current.email, removedRole: current.team_role, removedBy: user.email },
  })

  revalidatePath('/admin/team')
  return { success: true }
}
