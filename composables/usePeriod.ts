import type { DateRange, Preset } from '~/types'

export function usePeriod(key: string, initial: Preset = 'month') {
  const { timezone } = usePrefs()
  const preset = useState<Preset>(`period-${key}-preset`, () => initial)
  const custom = useState<DateRange>(`period-${key}-custom`, () => {
    const today = todayStr(timezone.value)
    return { from: startOfMonth(today), to: today }
  })
  const range = computed<DateRange>(() => {
    if (preset.value !== 'custom') return rangeFor(preset.value, timezone.value)
    const { from, to } = custom.value
    return from <= to ? { from, to } : { from: to, to: from }
  })
  return { preset, custom, range }
}
