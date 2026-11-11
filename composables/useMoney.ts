export const useMoney = () => {
  const { currency, lang } = usePrefs()
  return {
    currency,
    money: (n: number) => formatMoney(n, currency.value, lang.value),
    compact: (n: number) => formatCompact(n, lang.value)
  }
}
