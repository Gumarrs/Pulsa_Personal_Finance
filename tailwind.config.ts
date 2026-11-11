import type { Config } from 'tailwindcss'

const c = (v: string) => `rgb(var(--c-${v}) / <alpha-value>)`

const config: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        soft: c('soft'),
        fg: c('fg'),
        muted: c('muted'),
        line: c('line'),
        accent: c('accent'),
        'accent-fg': c('accent-fg'),
        income: c('income'),
        expense: c('expense'),
        transfer: c('transfer')
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  }
}

export default config
