import type { SupabaseClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const nuxt = useNuxtApp()
  return {
    client: nuxt.$supabase as unknown as SupabaseClient,
    configured: nuxt.$supabaseConfigured as unknown as boolean
  }
}
