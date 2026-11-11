// Format Rupiah: Rp10.000, Rp1.500.000. Mata uang lain memakai Intl.
export function formatMoney(value: number, currency = 'IDR', lang = 'id'): string {
  const n = Number.isFinite(value) ? value : 0
  const abs = Math.abs(n)
  let body: string
  if (currency === 'IDR') {
    body = 'Rp' + Math.round(abs).toLocaleString('id-ID')
  } else {
    body = new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(abs)
  }
  return n < 0 ? '-' + body : body
}

export function formatCompact(value: number, lang = 'id'): string {
  return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

// Input nominal: hanya digit, tanpa nol di depan, maksimal 13 digit
export function sanitizeAmount(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 13)
}

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
