'use server'

import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/activity'
import { InquiryStatus } from '@/types/admin'
import { revalidatePath } from 'next/cache'

async function checkInquiriesPermission() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: hasPerm } = await supabase.rpc('has_permission', { perm: 'inquiries.manage' })
  if (!hasPerm) {
    throw new Error('Forbidden: You do not have permission to manage inquiries')
  }

  return { supabase, user }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const { supabase, user } = await checkInquiriesPermission()

  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select('name, status')
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    action: 'UPDATE',
    entity: 'inquiry',
    entityId: id,
    summary: `Updated inquiry status for ${data.name} to ${status}`,
    details: { status, updatedBy: user.email },
  })

  revalidatePath('/admin/inquiries')
  return { success: true }
}

export async function deleteInquiry(id: string) {
  const { supabase, user } = await checkInquiriesPermission()

  const { data, error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id)
    .select('name')
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    action: 'DELETE',
    entity: 'inquiry',
    entityId: id,
    summary: `Deleted inquiry from ${data?.name || id}`,
    details: { deletedBy: user.email },
  })

  revalidatePath('/admin/inquiries')
  return { success: true }
}
