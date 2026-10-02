import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface LogActivityParams {
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'APPROVE'
    | 'REJECT'
    | 'ROLE_CHANGE'
    | 'INVITE'
    | 'LOGIN'
    | 'SETTINGS_CHANGE'
    | 'STATUS_CHANGE'
  entity:
    | 'property'
    | 'location'
    | 'review'
    | 'team_member'
    | 'page_settings'
    | 'agent'
    | 'inquiry'
    | 'user'
  entityId?: string
  summary: string
  details?: Record<string, unknown>
}

/**
 * Log an administrative action to the immutable activity_logs table.
 * Automatically captures the current user's session actor details.
 */
export async function logActivity({
  action,
  entity,
  entityId,
  summary,
  details = {},
}: LogActivityParams): Promise<void> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const adminClient = createAdminClient()

    await adminClient.from('activity_logs').insert({
      actor_id: user?.id || null,
      actor_email: user?.email || 'system@primehomekanpur.com',
      action,
      entity,
      entity_id: entityId || null,
      summary,
      details,
    })
  } catch (err) {
    // Fail-safe: activity logging should never crash the main operation
    console.error('Failed to write activity log:', err)
  }
}
