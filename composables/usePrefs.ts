export type Lang = 'id' | 'en'
export type Theme = 'light' | 'dark'

export const usePrefs = () => {
  const lang = useState<Lang>('pref-lang', () => 'id')
  const theme = useState<Theme>('pref-theme', () => 'light')
  const currency = useState<string>('pref-currency', () => 'IDR')
  const timezone = useState<string>('pref-tz', () => 'Asia/Jakarta')

  function load() {
    if (!import.meta.client) return
    const l = localStorage.getItem('pulsa-lang')
    const th = localStorage.getItem('pulsa-theme')
    const c = localStorage.getItem('pulsa-currency')
    if (l === 'id' || l === 'en') lang.value = l
    if (th === 'light' || th === 'dark') theme.value = th
    if (c) currency.value = c
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.documentElement.lang = lang.value
  }
  function setLang(l: Lang) {
    lang.value = l
    localStorage.setItem('pulsa-lang', l)
    document.documentElement.lang = l
  }
  function setTheme(th: Theme) {
    theme.value = th
    localStorage.setItem('pulsa-theme', th)
    document.documentElement.classList.toggle('dark', th === 'dark')
  }
  function setCurrency(c: string) {
    currency.value = c
    localStorage.setItem('pulsa-currency', c)
  }
  return { lang, theme, currency, timezone, load, setLang, setTheme, setCurrency }
}
