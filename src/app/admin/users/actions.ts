'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { revalidatePath } from 'next/cache'

async function checkUserRoleChangePermission() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized: Please sign in.')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const { data: member } = await supabase
    .from('team_members')
    .select('team_role, is_active')
    .or(`user_id.eq.${user.id},email.eq.${user.email?.toLowerCase()}`)
    .eq('is_active', true)
    .maybeSingle()

  const isAuthorized =
    profile?.role === 'ADMIN' ||
    member?.team_role === 'OWNER' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin'

  if (!isAuthorized) {
    throw new Error('Forbidden: Only an Admin or Owner can change user roles.')
  }

  let dbClient = supabase
  try {
    dbClient = createAdminClient()
  } catch {
    dbClient = supabase
  }

  return { supabase: dbClient, user }
}

export async function toggleUserRole(userId: string, newRole: 'ADMIN' | 'TENANT'): Promise<{ success: boolean; profile?: any; error?: string }> {
  try {
    const { supabase: adminClient, user } = await checkUserRoleChangePermission()

    if (userId === user.id) {
      return { success: false, error: 'You cannot change your own role' }
    }

    // Check if target user is in team_members
    const { data: teamRow } = await adminClient
      .from('team_members')
      .select('id, is_active, team_role')
      .eq('user_id', userId)
      .maybeSingle()

    if (teamRow && teamRow.is_active) {
      return {
        success: false,
        error: 'This user is an active member of the Admin Team. Manage their role or access via the Team Management page.',
      }
    }

    const { data: updated, error } = await adminClient
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('*')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    await logActivity({
      action: 'ROLE_CHANGE',
      entity: 'user',
      entityId: userId,
      summary: `Changed user role for ${updated.email || userId} to ${newRole}`,
      details: { newRole, targetEmail: updated.email, changedBy: user.email },
    })

    revalidatePath('/admin/users')
    return { success: true, profile: updated }
  } catch (err: any) {
    console.error('toggleUserRole error:', err)
    return { success: false, error: err.message || 'Failed to update user role' }
  }
}
