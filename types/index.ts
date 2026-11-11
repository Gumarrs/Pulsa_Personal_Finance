export type TxType = 'income' | 'expense' | 'transfer'
export type WalletType = 'cash' | 'bank' | 'e_wallet' | 'other'
export type Preset = 'today' | 'week' | 'month' | 'year' | 'custom'
export interface DateRange { from: string; to: string }

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  currency: string | null
  timezone: string | null
  locale: string | null
}
export interface Wallet {
  id: string
  user_id: string
  name: string
  type: WalletType
  initial_balance: number
  currency: string
  icon: string | null
  color: string | null
  is_archived: boolean
}
export interface Category {
  id: string
  user_id: string | null
  name: string
  type: 'income' | 'expense'
  icon: string | null
  color: string | null
  is_default: boolean
  is_archived: boolean
}
export interface Transaction {
  id: string
  user_id: string
  type: TxType
  amount: number
  category_id: string | null
  wallet_id: string
  to_wallet_id: string | null
  description: string | null
  notes: string | null
  transaction_date: string // YYYY-MM-DD (zona waktu pengguna)
  payment_method: string | null
}
export interface TxInput {
  type: TxType
  amount: number
  category_id: string | null
  wallet_id: string
  to_wallet_id: string | null
  description: string | null
  transaction_date: string
}
export interface WalletInput {
  name: string
  type: WalletType
  initial_balance: number
  color: string
}
