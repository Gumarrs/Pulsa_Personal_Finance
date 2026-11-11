import type { User } from '@supabase/supabase-js'

let initPromise: Promise<void> | null = null

export const useAuth = () => {
  const { client, configured } = useSupabase()
  const router = useRouter()
  const user = useState<User | null>('auth-user', () => null)
  const loadedFor = useState<string | null>('loaded-for', () => null)
  // State data dibersihkan saat logout (key sama dengan useData)
  const wallets = useState<unknown[]>('wallets', () => [])
  const categories = useState<unknown[]>('categories', () => [])
  const transactions = useState<unknown[]>('transactions', () => [])

  function init(): Promise<void> {
    if (!configured) return Promise.resolve()
    if (!initPromise) {
      initPromise = (async () => {
        const { data } = await client.auth.getSession()
        user.value = data.session?.user ?? null
        client.auth.onAuthStateChange((event, session) => {
          user.value = session?.user ?? null
          if (event === 'PASSWORD_RECOVERY') router.push('/reset-password')
        })
      })()
    }
    return initPromise
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
  }

  // true bila langsung punya sesi (konfirmasi email nonaktif)
  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin }
    })
    if (error) throw error
    if (data.session) user.value = data.user
    return Boolean(data.session)
  }

  async function sendReset(email: string) {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    if (error) throw error
  }

  async function updatePassword(password: string) {
    const { error } = await client.auth.updateUser({ password })
    if (error) throw error
  }

  async function signOut() {
    await client.auth.signOut()
    user.value = null
    loadedFor.value = null
    wallets.value = []
    categories.value = []
    transactions.value = []
    await router.replace('/login')
  }

  return { user, init, signIn, signUp, sendReset, updatePassword, signOut }
}
