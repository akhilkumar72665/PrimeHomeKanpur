import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Admin retrieves verified payment transactions and real financial reconciliation metrics
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // Verify Admin authorization
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin =
      profile?.role === 'admin' ||
      profile?.role === 'super_admin' ||
      profile?.role === 'ADMIN'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. Administrator privileges required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')

    let query = supabase
      .from('payment_transactions')
      .select(`
        *,
        property:properties(id, title, slug)
      `)
      .order('created_at', { ascending: false })

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter.toLowerCase())
    }

    const { data: transactions, error } = await query

    if (error) {
      console.warn('Payment transactions query notice:', error)
      return NextResponse.json({
        success: true,
        payments: [],
        metrics: {
          visitFeesCollected: 0,
          capturedCount: 0,
          refundedCount: 0,
          pendingCount: 0,
        },
      })
    }

    const txs = transactions || []
    const capturedTxs = txs.filter((t) => t.status === 'captured')
    const visitFeesCollected = capturedTxs.reduce((sum, t) => sum + Number(t.amount || 0), 0)

    return NextResponse.json({
      success: true,
      payments: txs,
      metrics: {
        visitFeesCollected,
        capturedCount: capturedTxs.length,
        refundedCount: txs.filter((t) => t.status === 'refunded').length,
        pendingCount: txs.filter((t) => t.status === 'pending').length,
      },
    })
  } catch (err: any) {
    console.error('Admin payments API error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
