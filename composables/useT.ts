import { messages } from '~/i18n/messages'

export const useT = () => {
  const { lang } = usePrefs()
  const t = (key: string, params?: Record<string, string | number>) => {
    let s = messages[lang.value][key] ?? messages.id[key] ?? key
    if (params) for (const [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, String(v))
    return s
  }
  return { t, lang }
}
