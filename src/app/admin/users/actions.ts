'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { revalidatePath } from 'next/cache'

async function checkUserRoleChangePermission() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: hasPerm } = await supabase.rpc('has_permission', { perm: 'users.role_change' })
  if (!hasPerm) {
    throw new Error('Forbidden: Only OWNER can change user roles')
  }

  return { user }
}

export async function toggleUserRole(userId: string, newRole: 'ADMIN' | 'TENANT') {
  const { user } = await checkUserRoleChangePermission()
  const adminClient = createAdminClient()

  if (userId === user.id) {
    throw new Error('You cannot change your own role')
  }

  // Check if target user is in team_members
  const { data: teamRow } = await adminClient
    .from('team_members')
    .select('id, is_active, team_role')
    .eq('user_id', userId)
    .single()

  if (teamRow && teamRow.is_active) {
    throw new Error(
      'This user is an active member of the Admin Team. Manage their role or access via the Team Management page.'
    )
  }

  const { data: updated, error } = await adminClient
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    action: 'ROLE_CHANGE',
    entity: 'user',
    entityId: userId,
    summary: `Changed user role for ${updated.email || userId} to ${newRole}`,
    details: { newRole, targetEmail: updated.email, changedBy: user.email },
  })

  revalidatePath('/admin/users')
  return { success: true, profile: updated }
}
