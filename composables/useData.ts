import type { Category, Profile, Transaction, TxInput, Wallet, WalletInput, WalletType } from '~/types'

let inflight: Promise<void> | null = null

const WALLET_ICON: Record<WalletType, string> = { cash: 'banknote', bank: 'landmark', e_wallet: 'smartphone', other: 'wallet' }

export const useData = () => {
  const { client } = useSupabase()
  const { user } = useAuth()
  const { timezone, currency } = usePrefs()

  const wallets = useState<Wallet[]>('wallets', () => [])
  const categories = useState<Category[]>('categories', () => [])
  const transactions = useState<Transaction[]>('transactions', () => [])
  const profile = useState<Profile | null>('profile', () => null)
  // null = view wallet_balances tidak tersedia / kolomnya tidak dikenali
  const balances = useState<Record<string, number> | null>('balances', () => null)
  const balanceViewMissing = useState('balance-missing', () => false)
  const loadedFor = useState<string | null>('loaded-for', () => null)
  const loading = useState('data-loading', () => false)

  const uid = () => {
    if (!user.value) throw new Error('Not authenticated')
    return user.value.id
  }

  const normTx = (r: any): Transaction => ({
    ...r,
    amount: Number(r.amount) || 0,
    transaction_date: txDate(String(r.transaction_date), timezone.value)
  })
  const normWallet = (r: any): Wallet => ({ ...r, initial_balance: Number(r.initial_balance) || 0, is_archived: Boolean(r.is_archived) })

  async function fetchTransactions(): Promise<Transaction[]> {
    const all: Transaction[] = []
    const size = 1000
    for (let from = 0; ; from += size) {
      const { data, error } = await client
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .order('id', { ascending: false })
        .range(from, from + size - 1)
      if (error) throw error
      all.push(...(data as any[]).map(normTx))
      if (!data || data.length < size) break
    }
    return all
  }

  // Hanya membaca view wallet_balances (tidak pernah INSERT/UPDATE/DELETE)
  async function fetchBalances() {
    const { data, error } = await client.from('wallet_balances').select('*')
    if (error || !data) {
      balances.value = null
      balanceViewMissing.value = true
      return
    }
    const map: Record<string, number> = {}
    for (const r of data as any[]) {
      const id = r.wallet_id ?? r.id
      const val = r.balance ?? r.current_balance ?? r.final_balance
      if (id != null && val != null) map[String(id)] = Number(val)
    }
    if (!Object.keys(map).length && wallets.value.length) {
      balances.value = null
      balanceViewMissing.value = true
      return
    }
    balances.value = map
    balanceViewMissing.value = false
  }

  async function loadAll() {
    const id = uid()
    loading.value = true
    try {
      const [p, w, c] = await Promise.all([
        client.from('profiles').select('*').eq('id', id).maybeSingle(),
        client.from('wallets').select('*').order('name'),
        client.from('categories').select('*').order('name')
      ])
      if (w.error) throw w.error
      if (c.error) throw c.error
      profile.value = (p.data as Profile) ?? null
      if (p.data?.timezone) timezone.value = p.data.timezone
      if (p.data?.currency && !localStorage.getItem('pulsa-currency')) currency.value = p.data.currency
      wallets.value = (w.data as any[]).map(normWallet)
      categories.value = c.data as Category[]
      transactions.value = await fetchTransactions()
      await fetchBalances()
      loadedFor.value = id
    } finally {
      loading.value = false
    }
  }

  async function ensureLoaded(force = false) {
    if (!user.value) return
    if (!force && loadedFor.value === user.value.id) return
    if (!inflight) inflight = loadAll().finally(() => { inflight = null })
    await inflight
  }

  async function refresh() {
    const w = await client.from('wallets').select('*').order('name')
    if (w.error) throw w.error
    wallets.value = (w.data as any[]).map(normWallet)
    transactions.value = await fetchTransactions()
    await fetchBalances()
  }

  // Fallback hanya bila view wallet_balances tidak tersedia
  function computeBalance(w: Wallet) {
    let b = w.initial_balance
    for (const t of transactions.value) {
      if (t.type === 'income' && t.wallet_id === w.id) b += t.amount
      else if (t.type === 'expense' && t.wallet_id === w.id) b -= t.amount
      else if (t.type === 'transfer') {
        if (t.wallet_id === w.id) b -= t.amount
        if (t.to_wallet_id === w.id) b += t.amount
      }
    }
    return round2(b)
  }
  const walletBalance = (w: Wallet) => balances.value?.[w.id] ?? computeBalance(w)

  const activeWallets = computed(() => wallets.value.filter(w => !w.is_archived))
  const totalBalance = computed(() => round2(activeWallets.value.reduce((s, w) => s + walletBalance(w), 0)))

  async function saveTransaction(input: TxInput, id?: string) {
    const q = id
      ? client.from('transactions').update(input).eq('id', id)
      : client.from('transactions').insert({ ...input, user_id: uid() })
    const { error } = await q
    if (error) throw error
    await refresh()
  }
  async function deleteTransaction(id: string) {
    const { error } = await client.from('transactions').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }
  async function createWallet(input: WalletInput) {
    const { error } = await client.from('wallets').insert({
      user_id: uid(),
      name: input.name,
      type: input.type,
      initial_balance: input.initial_balance,
      currency: currency.value,
      color: input.color,
      icon: WALLET_ICON[input.type]
    })
    if (error) throw error
    await refresh()
  }
  async function updateWallet(id: string, input: WalletInput) {
    const { error } = await client
      .from('wallets')
      .update({ name: input.name, type: input.type, initial_balance: input.initial_balance, color: input.color, icon: WALLET_ICON[input.type] })
      .eq('id', id)
    if (error) throw error
    await refresh()
  }
  async function setWalletArchived(id: string, archived: boolean) {
    const { error } = await client.from('wallets').update({ is_archived: archived }).eq('id', id)
    if (error) throw error
    await refresh()
  }

  return {
    wallets, categories, transactions, profile, balances, balanceViewMissing, loadedFor, loading,
    activeWallets, totalBalance, walletBalance,
    ensureLoaded, refresh, saveTransaction, deleteTransaction, createWallet, updateWallet, setWalletArchived
  }
}
