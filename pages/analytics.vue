<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-vue-next'

const { t, lang } = useT()
const { money } = useMoney()
const { timezone } = usePrefs()
const { preset, custom, range } = usePeriod('analytics')
const { transactions, categories, loadedFor } = useData()
const router = useRouter()

const ready = computed(() => Boolean(loadedFor.value))
const periodTx = computed(() => inRange(transactions.value, range.value))
const prev = computed(() => prevRange(range.value))
const prevTx = computed(() => inRange(transactions.value, prev.value))
const cur = computed(() => summarize(periodTx.value))
const old = computed(() => summarize(prevTx.value))
const uncat = computed(() => t('common.uncategorized'))
const expCats = computed(() => byCategory(periodTx.value, 'expense', categories.value, uncat.value))
const incCats = computed(() => byCategory(periodTx.value, 'income', categories.value, uncat.value))
const daily = computed(() => bucketSeries(periodTx.value, range.value, lang.value, true))
const monthly = computed(() => lastMonths(transactions.value, 12, todayStr(timezone.value), lang.value))

const label = (r: { from: string; to: string }) =>
  r.from === r.to ? formatDate(r.from, lang.value) : `${formatDate(r.from, lang.value)} – ${formatDate(r.to, lang.value)}`

const dailySets = computed(() => [
  { label: t('common.expense'), data: daily.value.expense, borderColor: '#ef6a6a', backgroundColor: 'rgba(239,106,106,0.12)', fill: true, tension: 0.3, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 }
])
const monthlySets = computed(() => [
  { label: t('common.expense'), data: monthly.value.expense, backgroundColor: '#ef6a6a', borderRadius: 4, maxBarThickness: 28 }
])
const compareSets = computed(() => [
  { label: t('analytics.current'), data: [cur.value.income, cur.value.expense, cur.value.net], backgroundColor: '#10b981', borderRadius: 4, maxBarThickness: 28 },
  { label: t('analytics.previous'), data: [old.value.income, old.value.expense, old.value.net], backgroundColor: '#94a3b8', borderRadius: 4, maxBarThickness: 28 }
])
const compareLabels = computed(() => [t('common.income'), t('common.expense'), t('dash.net')])
const donut = (items: { total: number; color: string }[]) => [{ data: items.map(i => i.total), backgroundColor: items.map(i => i.color), borderWidth: 0 }]

const rows = computed(() => [
  { key: 'common.income', cur: cur.value.income, old: old.value.income, goodWhenUp: true },
  { key: 'common.expense', cur: cur.value.expense, old: old.value.expense, goodWhenUp: false },
  { key: 'dash.net', cur: cur.value.net, old: old.value.net, goodWhenUp: true }
])
function delta(c: number, o: number) {
  if (!o) return null
  return ((c - o) / Math.abs(o)) * 100
}
function deltaClass(c: number, o: number, goodWhenUp: boolean) {
  const d = delta(c, o)
  if (d === null || d === 0) return 'text-muted'
  return (d > 0) === goodWhenUp ? 'text-income' : 'text-expense'
}
function deltaText(c: number, o: number) {
  const d = delta(c, o)
  return d === null ? '—' : `${d > 0 ? '+' : ''}${d.toFixed(1)}%`
}

function goCategory(type: 'income' | 'expense', c: { id: string }) {
  if (!c.id) return
  router.push({ path: '/transactions', query: { category: c.id, type, from: range.value.from, to: range.value.to } })
}
</script>

<template>
  <div>
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold tracking-tight">{{ t('nav.analytics') }}</h1>
        <p class="truncate text-sm text-muted">{{ label(range) }}</p>
      </div>
      <PeriodFilter v-model:preset="preset" v-model:custom="custom" />
    </div>

    <div v-if="!ready" class="space-y-4">
      <div class="grid grid-cols-3 gap-3"><SkeletonBlock v-for="n in 3" :key="n" class="h-24" /></div>
      <SkeletonBlock class="h-64" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard :label="t('dash.income')" :value="money(cur.income)" tone="income" :icon="ArrowDownLeft" />
        <SummaryCard :label="t('dash.expense')" :value="money(cur.expense)" tone="expense" :icon="ArrowUpRight" />
        <SummaryCard :label="t('dash.net')" :value="money(cur.net)" :tone="cur.net < 0 ? 'expense' : 'income'" :icon="Scale" />
      </div>

      <section class="card mt-4 grid min-w-0 gap-4 p-4 md:grid-cols-2">
        <div class="min-w-0">
          <h2 class="text-sm font-medium">{{ t('analytics.compare') }}</h2>
          <p class="mb-3 text-xs text-muted">{{ t('analytics.vs', { range: label(prev) }) }}</p>
          <ul class="divide-y divide-line text-sm">
            <li v-for="r in rows" :key="r.key" class="flex items-center justify-between gap-3 py-2.5">
              <span class="text-muted">{{ t(r.key) }}</span>
              <span class="num flex min-w-0 flex-col items-end">
                <span class="truncate font-medium">{{ money(r.cur) }}</span>
                <span class="truncate text-xs text-muted">{{ money(r.old) }}</span>
              </span>
              <span class="num w-16 shrink-0 text-right text-xs font-medium" :class="deltaClass(r.cur, r.old, r.goodWhenUp)">{{ deltaText(r.cur, r.old) }}</span>
            </li>
          </ul>
        </div>
        <div class="h-52 min-w-0"><ChartCanvas type="bar" :labels="compareLabels" :datasets="compareSets" /></div>
      </section>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <section class="card min-w-0 p-4">
          <h2 class="mb-3 text-sm font-medium">{{ t('analytics.expenseByCat') }}</h2>
          <template v-if="expCats.length">
            <div class="mb-4 h-48"><ChartCanvas type="doughnut" :labels="expCats.map(c => c.name)" :datasets="donut(expCats)" @select="i => goCategory('expense', expCats[i])" /></div>
            <CategoryBreakdown :items="expCats" @select="c => goCategory('expense', c)" />
          </template>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>
        <section class="card min-w-0 p-4">
          <h2 class="mb-3 text-sm font-medium">{{ t('analytics.incomeByCat') }}</h2>
          <template v-if="incCats.length">
            <div class="mb-4 h-48"><ChartCanvas type="doughnut" :labels="incCats.map(c => c.name)" :datasets="donut(incCats)" @select="i => goCategory('income', incCats[i])" /></div>
            <CategoryBreakdown :items="incCats" @select="c => goCategory('income', c)" />
          </template>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>
        <section class="card min-w-0 p-4">
          <h2 class="mb-3 text-sm font-medium">{{ t('analytics.daily') }}</h2>
          <div v-if="periodTx.length" class="h-56"><ChartCanvas type="line" :labels="daily.labels" :datasets="dailySets" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>
        <section class="card min-w-0 p-4">
          <h2 class="text-sm font-medium">{{ t('analytics.monthly') }}</h2>
          <p class="mb-3 text-xs text-muted">{{ t('analytics.last12') }}</p>
          <div class="h-52"><ChartCanvas type="bar" :labels="monthly.labels" :datasets="monthlySets" /></div>
        </section>
      </div>
    </template>
  </div>
</template>
