'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { InquiryStatus } from '@/types/admin'
import { revalidatePath } from 'next/cache'

async function checkInquiriesPermission() {
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

  let hasPerm = false
  try {
    const res = await supabase.rpc('has_permission', { perm: 'inquiries.manage' })
    hasPerm = !!res.data
  } catch {
    hasPerm = false
  }

  const isAuthorized =
    hasPerm ||
    profile?.role === 'ADMIN' ||
    member?.is_active === true ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin'

  if (!isAuthorized) {
    throw new Error('Forbidden: You do not have permission to manage inquiries.')
  }

  let dbClient = supabase
  try {
    dbClient = createAdminClient()
  } catch {
    dbClient = supabase
  }

  return { supabase: dbClient, user }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await checkInquiriesPermission()

    const { data, error } = await supabase
      .from('inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('name, status')
      .maybeSingle()

    if (error) {
      return { success: false, error: error.message }
    }

    await logActivity({
      action: 'UPDATE',
      entity: 'inquiry',
      entityId: id,
      summary: `Updated inquiry status for ${data?.name || id} to ${status}`,
      details: { status, updatedBy: user.email },
    })

    revalidatePath('/admin/inquiries')
    return { success: true }
  } catch (err: any) {
    console.error('updateInquiryStatus error:', err)
    return { success: false, error: err.message || 'Failed to update inquiry status' }
  }
}

export async function deleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await checkInquiriesPermission()

    const { data, error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)
      .select('name')
      .maybeSingle()

    if (error) {
      return { success: false, error: error.message }
    }

    await logActivity({
      action: 'DELETE',
      entity: 'inquiry',
      entityId: id,
      summary: `Deleted inquiry from ${data?.name || id}`,
      details: { deletedBy: user.email },
    })

    revalidatePath('/admin/inquiries')
    return { success: true }
  } catch (err: any) {
    console.error('deleteInquiry error:', err)
    return { success: false, error: err.message || 'Failed to delete inquiry' }
  }
}
