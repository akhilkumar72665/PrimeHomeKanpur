'use server'

import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/activity'
import { revalidatePath } from 'next/cache'

async function checkAgentPermission() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: hasPerm } = await supabase.rpc('has_permission', { perm: 'agents.manage' })
  if (!hasPerm) {
    throw new Error('Forbidden: You do not have permission to manage agents')
  }

  return { supabase, user }
}

export async function createAgent(payload: {
  name: string
  phone?: string
  email?: string
  bio?: string
  photo_url?: string
  is_active?: boolean
}) {
  const { supabase, user } = await checkAgentPermission()

  const { data, error } = await supabase
    .from('agents')
    .insert({
      name: payload.name.trim(),
      phone: payload.phone?.trim() || null,
      email: payload.email?.trim() || null,
      bio: payload.bio?.trim() || null,
      photo_url: payload.photo_url || null,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    action: 'CREATE',
    entity: 'agent',
    entityId: data.id,
    summary: `Created agent profile for ${data.name}`,
    details: { agent: data, createdBy: user.email },
  })

  revalidatePath('/admin/agents')
  return { success: true, agent: data }
}

export async function updateAgent(
  id: string,
  payload: {
    name?: string
    phone?: string
    email?: string
    bio?: string
    photo_url?: string
    is_active?: boolean
  }
) {
  const { supabase, user } = await checkAgentPermission()

  const { data, error } = await supabase
    .from('agents')
    .update({
      ...payload,
      name: payload.name ? payload.name.trim() : undefined,
      phone: payload.phone !== undefined ? payload.phone?.trim() || null : undefined,
      email: payload.email !== undefined ? payload.email?.trim() || null : undefined,
      bio: payload.bio !== undefined ? payload.bio?.trim() || null : undefined,
      photo_url: payload.photo_url !== undefined ? payload.photo_url || null : undefined,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    action: 'UPDATE',
    entity: 'agent',
    entityId: id,
    summary: `Updated agent profile for ${data.name}`,
    details: { changes: payload, updatedBy: user.email },
  })

  revalidatePath('/admin/agents')
  return { success: true, agent: data }
}

export async function deleteAgent(id: string) {
  const { supabase, user } = await checkAgentPermission()

  // Find properties linked to this agent and unlink them
  const { count } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('agent_id', id)

  if (count && count > 0) {
    await supabase
      .from('properties')
      .update({ agent_id: null })
      .eq('agent_id', id)
  }

  // Delete agent
  const { data: agent, error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)
    .select('name')
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    action: 'DELETE',
    entity: 'agent',
    entityId: id,
    summary: `Deleted agent profile ${agent?.name || id} (unlinked ${count || 0} properties)`,
    details: { unlinkedPropertiesCount: count || 0, deletedBy: user.email },
  })

  revalidatePath('/admin/agents')
  return { success: true, unlinkedCount: count || 0 }
}
