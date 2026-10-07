import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please sign in.' }, { status: 401 })
    }

    let adminClient
    try {
      adminClient = createAdminClient()
    } catch {
      adminClient = supabase
    }

    // 2. Verify Admin Access
    let profile = null
    let teamMember = null
    try {
      const res = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      profile = res.data
    } catch {}

    try {
      const res = await adminClient
        .from('team_members')
        .select('team_role, is_active')
        .or(`user_id.eq.${user.id},email.eq.${user.email?.toLowerCase()}`)
        .eq('is_active', true)
        .maybeSingle()
      teamMember = res.data
    } catch {}

    const isAdmin =
      profile?.role === 'ADMIN' ||
      teamMember?.is_active === true ||
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required.' },
        { status: 403 }
      )
    }

    // 3. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'ALL'
    const entity = searchParams.get('entity') || 'ALL'
    const search = (searchParams.get('search') || '').trim()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)))

    // 4. Query activity logs
    let query = adminClient
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (action !== 'ALL') {
      query = query.eq('action', action)
    }
    if (entity !== 'ALL') {
      query = query.eq('entity', entity)
    }
    if (search) {
      query = query.or(
        `summary.ilike.%${search}%,actor_email.ilike.%${search}%,entity_id.ilike.%${search}%`
      )
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.warn('Activity logs query notice:', error.message)
      return NextResponse.json({
        logs: [],
        totalCount: 0,
        page,
        pageSize,
      })
    }

    return NextResponse.json({
      logs: data || [],
      totalCount: count || 0,
      page,
      pageSize,
    })
  } catch (err: any) {
    console.error('Activity logs route error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
