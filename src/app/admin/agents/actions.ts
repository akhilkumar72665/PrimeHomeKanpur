'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { revalidatePath } from 'next/cache'

async function checkAgentPermission() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized: Please sign in.')

  // Check role in profiles or team_members
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
    const res = await supabase.rpc('has_permission', { perm: 'agents.manage' })
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
    throw new Error('Forbidden: You do not have permission to manage agents.')
  }

  let dbClient = supabase
  try {
    dbClient = createAdminClient()
  } catch {
    dbClient = supabase
  }

  return { supabase: dbClient, user }
}

export async function createAgent(payload: {
  name: string
  phone?: string
  email?: string
  bio?: string
  photo_url?: string
  is_active?: boolean
}): Promise<{ success: boolean; agent?: any; error?: string }> {
  try {
    const { supabase, user } = await checkAgentPermission()

    const name = payload.name.trim()
    if (!name) return { success: false, error: 'Agent name is required' }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { data, error } = await supabase
      .from('agents')
      .insert({
        name,
        slug,
        phone: payload.phone?.trim() || null,
        email: payload.email?.trim() || null,
        bio: payload.bio?.trim() || null,
        photo_url: payload.photo_url || null,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Create agent error:', error)
      return { success: false, error: error.message }
    }

    await logActivity({
      action: 'CREATE',
      entity: 'agent',
      entityId: data.id,
      summary: `Created specialist agent profile for ${data.name}`,
      details: { agent: data, createdBy: user.email },
    })

    revalidatePath('/admin/agents')
    return { success: true, agent: data }
  } catch (err: any) {
    console.error('createAgent caught exception:', err)
    return { success: false, error: err.message || 'Failed to create agent profile' }
  }
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
): Promise<{ success: boolean; agent?: any; error?: string }> {
  try {
    const { supabase, user } = await checkAgentPermission()

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (payload.name !== undefined) updates.name = payload.name.trim()
    if (payload.phone !== undefined) updates.phone = payload.phone?.trim() || null
    if (payload.email !== undefined) updates.email = payload.email?.trim() || null
    if (payload.bio !== undefined) updates.bio = payload.bio?.trim() || null
    if (payload.photo_url !== undefined) updates.photo_url = payload.photo_url || null
    if (payload.is_active !== undefined) updates.is_active = payload.is_active

    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    await logActivity({
      action: 'UPDATE',
      entity: 'agent',
      entityId: id,
      summary: `Updated specialist agent profile for ${data.name}`,
      details: { changes: payload, updatedBy: user.email },
    })

    revalidatePath('/admin/agents')
    return { success: true, agent: data }
  } catch (err: any) {
    console.error('updateAgent caught exception:', err)
    return { success: false, error: err.message || 'Failed to update agent profile' }
  }
}

export async function deleteAgent(id: string): Promise<{ success: boolean; unlinkedCount?: number; error?: string }> {
  try {
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

    if (error) {
      return { success: false, error: error.message }
    }

    await logActivity({
      action: 'DELETE',
      entity: 'agent',
      entityId: id,
      summary: `Deleted agent profile ${agent?.name || id} (unlinked ${count || 0} properties)`,
      details: { unlinkedPropertiesCount: count || 0, deletedBy: user.email },
    })

    revalidatePath('/admin/agents')
    return { success: true, unlinkedCount: count || 0 }
  } catch (err: any) {
    console.error('deleteAgent caught exception:', err)
    return { success: false, error: err.message || 'Failed to delete agent profile' }
  }
}
