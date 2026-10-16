import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://unwifyqenmopagltuqew.supabase.co'
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud2lmeXFlbm1vcGFnbHR1cWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTYwNzksImV4cCI6MjEwNjUzMjA3OX0.OQnLewVtacUhHaJFumactBcFOG_Wten0tocowEXeYd4'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_ANON_KEY

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
