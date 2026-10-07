'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { TeamRole } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'

async function getCallerOwnerSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized: Please sign in.')

  // Check role in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  // Check role in team_members
  const { data: member } = await supabase
    .from('team_members')
    .select('team_role, is_active')
    .or(`user_id.eq.${user.id},email.eq.${user.email?.toLowerCase()}`)
    .eq('is_active', true)
    .maybeSingle()

  const isOwnerOrAdmin =
    profile?.role === 'ADMIN' ||
    member?.team_role === 'OWNER' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin'

  if (!isOwnerOrAdmin) {
    throw new Error('Forbidden: Only an OWNER or Platform Admin can manage team members.')
  }

  let dbClient = supabase
  try {
    dbClient = createAdminClient()
  } catch {
    dbClient = supabase
  }

  return { supabase: dbClient, user, member }
}

export async function addTeamMember(payload: {
  email: string
  name: string
  phone?: string
  designation?: string
  team_role: TeamRole
  photo_url?: string
  is_active?: boolean
}): Promise<{ success: boolean; member?: any; error?: string }> {
  try {
    const { supabase: adminClient, user } = await getCallerOwnerSession()
    const email = payload.email.trim().toLowerCase()

    if (!email) return { success: false, error: 'Email is required' }
    if (!payload.name.trim()) return { success: false, error: 'Name is required' }

    // Check if team member already exists
    const { data: existing } = await adminClient
      .from('team_members')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'A team member with this email already exists' }
    }

    // Check if user already exists in auth.users if admin auth is available
    let assignedUserId: string | null = null
    try {
      if (adminClient.auth?.admin) {
        const { data: userList } = await adminClient.auth.admin.listUsers()
        const matchedAuthUser = userList?.users?.find(
          (u: any) => u.email?.toLowerCase() === email
        )

        if (matchedAuthUser) {
          assignedUserId = matchedAuthUser.id
        } else {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const { data: inviteData } = await adminClient.auth.admin.inviteUserByEmail(
            email,
            { redirectTo: `${siteUrl}/auth/callback` }
          ).catch(() => ({ data: null }))
          if (inviteData?.user) {
            assignedUserId = inviteData.user.id
          }
        }
      }
    } catch {
      // Non-fatal if auth admin invite fails
    }

    // Insert into team_members
    const { data: newMember, error: insertErr } = await adminClient
      .from('team_members')
      .insert({
        email,
        name: payload.name.trim(),
        phone: payload.phone?.trim() || null,
        designation: payload.designation?.trim() || 'Operations',
        team_role: payload.team_role,
        photo_url: payload.photo_url || null,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
        user_id: assignedUserId,
        invited_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (insertErr) {
      return { success: false, error: `Failed to create team member: ${insertErr.message}` }
    }

    // If user exists, sync profile to ADMIN
    if (assignedUserId) {
      try {
        await adminClient
          .from('profiles')
          .upsert({
            id: assignedUserId,
            email,
            full_name: payload.name.trim(),
            role: 'ADMIN',
            updated_at: new Date().toISOString(),
          })
      } catch {
        // Non-critical profile sync error
      }
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
  } catch (err: any) {
    console.error('addTeamMember error:', err)
    return { success: false, error: err.message || 'Failed to add team member' }
  }
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
): Promise<{ success: boolean; member?: any; error?: string }> {
  try {
    const { supabase: adminClient, user } = await getCallerOwnerSession()

    // Fetch current member
    const { data: current, error: fetchErr } = await adminClient
      .from('team_members')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchErr || !current) return { success: false, error: 'Team member not found' }

    // Check self-demote / self-deactivate
    if (current.user_id === user.id) {
      if (payload.team_role && payload.team_role !== 'OWNER') {
        return { success: false, error: 'You cannot change your own role from OWNER' }
      }
      if (payload.is_active === false) {
        return { success: false, error: 'You cannot deactivate your own account' }
      }
    }

    const { data: updated, error: updateErr } = await adminClient
      .from('team_members')
      .update({
        ...payload,
        name: payload.name ? payload.name.trim() : undefined,
        phone: payload.phone !== undefined ? payload.phone?.trim() || null : undefined,
        designation: payload.designation !== undefined ? payload.designation?.trim() || 'Operations' : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (updateErr) return { success: false, error: `Failed to update team member: ${updateErr.message}` }

    // Sync profile role if active status changed
    if (current.user_id) {
      try {
        if (payload.is_active === false) {
          await adminClient.from('profiles').update({ role: 'TENANT' }).eq('id', current.user_id)
        } else if (payload.is_active === true) {
          await adminClient.from('profiles').update({ role: 'ADMIN' }).eq('id', current.user_id)
        }
      } catch {
        // Non-critical profile sync error
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
  } catch (err: any) {
    console.error('updateTeamMember error:', err)
    return { success: false, error: err.message || 'Failed to update team member' }
  }
}

export async function removeTeamMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase: adminClient, user } = await getCallerOwnerSession()

    const { data: current, error: fetchErr } = await adminClient
      .from('team_members')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchErr || !current) return { success: false, error: 'Team member not found' }

    if (current.user_id === user.id) {
      return { success: false, error: 'You cannot remove your own team membership' }
    }

    const { error: delErr } = await adminClient
      .from('team_members')
      .delete()
      .eq('id', id)

    if (delErr) return { success: false, error: `Failed to remove team member: ${delErr.message}` }

    if (current.user_id) {
      try {
        await adminClient
          .from('profiles')
          .update({ role: 'TENANT' })
          .eq('id', current.user_id)
      } catch {
        // Non-critical profile sync error
      }
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
  } catch (err: any) {
    console.error('removeTeamMember error:', err)
    return { success: false, error: err.message || 'Failed to remove team member' }
  }
}
