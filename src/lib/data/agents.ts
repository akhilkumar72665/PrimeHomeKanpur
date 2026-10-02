import { createClient } from '@/lib/supabase/server'
import { Agent } from '@/types'
import { mockAgents } from '@/lib/data/mockData'

export async function getAgents(): Promise<Agent[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return mockAgents
    }

    return data
  } catch {
    return mockAgents
  }
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return mockAgents.find(a => a.slug === slug) || null
    }

    return data
  } catch {
    return mockAgents.find(a => a.slug === slug) || null
  }
}
