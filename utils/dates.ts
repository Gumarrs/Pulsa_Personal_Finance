import type { DateRange, Preset } from '~/types'

const utc = (s: string) => new Date(s + 'T00:00:00Z')
const iso = (d: Date) => d.toISOString().slice(0, 10)

export const todayStr = (tz = 'Asia/Jakarta') =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

export const addDays = (s: string, n: number) => {
  const d = utc(s)
  d.setUTCDate(d.getUTCDate() + n)
  return iso(d)
}
export const startOfMonth = (s: string) => s.slice(0, 8) + '01'
export const endOfMonth = (s: string) => {
  const d = utc(startOfMonth(s))
  d.setUTCMonth(d.getUTCMonth() + 1, 0)
  return iso(d)
}
export const addMonths = (s: string, n: number) => {
  const d = utc(startOfMonth(s))
  d.setUTCMonth(d.getUTCMonth() + n)
  return iso(d)
}
// Minggu dimulai hari Senin
export const startOfWeek = (s: string) => addDays(s, -((utc(s).getUTCDay() + 6) % 7))
export const daysBetween = (a: string, b: string) => Math.round((utc(b).getTime() - utc(a).getTime()) / 86400000)

export function eachDay(from: string, to: string) {
  const out: string[] = []
  let d = from
  while (d <= to && out.length < 3700) {
    out.push(d)
    d = addDays(d, 1)
  }
  return out
}

export function rangeFor(p: Preset, tz: string): DateRange {
  const today = todayStr(tz)
  if (p === 'week') {
    const s = startOfWeek(today)
    return { from: s, to: addDays(s, 6) }
  }
  if (p === 'month') return { from: startOfMonth(today), to: endOfMonth(today) }
  if (p === 'year') return { from: today.slice(0, 4) + '-01-01', to: today.slice(0, 4) + '-12-31' }
  return { from: today, to: today }
}

// Periode sebelumnya dengan panjang hari yang sama
export function prevRange(r: DateRange): DateRange {
  const len = daysBetween(r.from, r.to) + 1
  return { from: addDays(r.from, -len), to: addDays(r.from, -1) }
}

// transaction_date bisa bertipe date (YYYY-MM-DD) atau timestamptz; selalu kembalikan tanggal di zona waktu pengguna
export function txDate(raw: string, tz: string) {
  if (raw.length <= 10) return raw
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw.slice(0, 10)
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

export function formatDate(s: string, lang = 'id', opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return utc(s).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { timeZone: 'UTC', ...opts })
}
export const monthLabel = (s: string, lang = 'id') => formatDate(s, lang, { month: 'short', year: '2-digit' })
