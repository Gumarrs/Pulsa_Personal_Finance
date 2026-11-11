import type { Category, DateRange, Transaction } from '~/types'

export const PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#e05656', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#64748b']
export const safeColor = (c: string | null | undefined, i = 0) =>
  c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : PALETTE[i % PALETTE.length]

export const inRange = (txs: Transaction[], r: DateRange) =>
  txs.filter(t => t.transaction_date >= r.from && t.transaction_date <= r.to)

// Transfer TIDAK dihitung sebagai pemasukan maupun pengeluaran
export function summarize(txs: Transaction[]) {
  let income = 0
  let expense = 0
  for (const t of txs) {
    if (t.type === 'income') income += t.amount
    else if (t.type === 'expense') expense += t.amount
  }
  income = round2(income)
  expense = round2(expense)
  return { income, expense, net: round2(income - expense) }
}

export interface CatTotal { id: string; name: string; color: string; total: number; share: number }

export function byCategory(txs: Transaction[], type: 'income' | 'expense', cats: Category[], uncat: string): CatTotal[] {
  const map = new Map<string, number>()
  for (const t of txs) {
    if (t.type !== type) continue
    const k = t.category_id ?? ''
    map.set(k, (map.get(k) || 0) + t.amount)
  }
  const sum = [...map.values()].reduce((a, b) => a + b, 0)
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, total], i) => {
      const c = cats.find(x => x.id === id)
      return { id, name: c?.name ?? uncat, color: safeColor(c?.color, i), total: round2(total), share: sum ? total / sum : 0 }
    })
}

export function bucketSeries(txs: Transaction[], r: DateRange, lang: string, forceDaily = false) {
  const daily = forceDaily || daysBetween(r.from, r.to) + 1 <= 31
  const keys: string[] = []
  if (daily) keys.push(...eachDay(r.from, r.to))
  else {
    let m = startOfMonth(r.from)
    while (m <= r.to && keys.length < 600) {
      keys.push(m)
      m = addMonths(m, 1)
    }
  }
  const idx = new Map(keys.map((k, i) => [k, i]))
  const income = keys.map(() => 0)
  const expense = keys.map(() => 0)
  for (const t of txs) {
    if (t.type === 'transfer') continue
    const i = idx.get(daily ? t.transaction_date : startOfMonth(t.transaction_date))
    if (i === undefined) continue
    if (t.type === 'income') income[i] += t.amount
    else expense[i] += t.amount
  }
  const labels = keys.map(k => (daily ? formatDate(k, lang, { day: 'numeric', month: 'short' }) : monthLabel(k, lang)))
  return { labels, income: income.map(round2), expense: expense.map(round2) }
}

// 12 bulan terakhir (termasuk bulan berjalan), tidak terpengaruh filter
export function lastMonths(txs: Transaction[], n: number, today: string, lang: string) {
  const first = addMonths(today, -(n - 1))
  const to = endOfMonth(today)
  return bucketSeries(
    txs.filter(t => t.transaction_date >= first && t.transaction_date <= to),
    { from: first, to },
    lang,
    false
  )
}
