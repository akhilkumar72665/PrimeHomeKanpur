import { createClient } from '@/lib/supabase/server'
import { FAQ } from '@/types'
import { mockFaqs } from '@/lib/data/mockData'

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return mockFaqs
    }

    return data
  } catch {
    return mockFaqs
  }
}
