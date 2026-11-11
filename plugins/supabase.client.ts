import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public
  const url = String(cfg.supabaseUrl || '')
  const key = String(cfg.supabasePublishableKey || '')
  const configured = Boolean(url && key)
  // Hanya publishable key; service role key TIDAK boleh dipakai di frontend.
  const supabase = configured
    ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
    : null
  return { provide: { supabase, supabaseConfigured: configured } }
})
