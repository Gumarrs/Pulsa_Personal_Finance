<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight, Banknote, BarChart3, Landmark, PieChart, Plus, Receipt, Scale, Smartphone, TrendingDown, Trophy, Wallet as WalletIcon } from 'lucide-vue-next'
import type { WalletType } from '~/types'

const { t, lang } = useT()
const { money } = useMoney()
const { preset, custom, range } = usePeriod('dash')
const { transactions, categories, activeWallets, totalBalance, walletBalance, loadedFor } = useData()
const { open } = useTxModal()
const router = useRouter()

const ready = computed(() => Boolean(loadedFor.value))
const hasAny = computed(() => transactions.value.length > 0)
const periodTx = computed(() => inRange(transactions.value, range.value))
const hasPeriod = computed(() => periodTx.value.length > 0)
const totals = computed(() => summarize(periodTx.value))
const series = computed(() => bucketSeries(periodTx.value, range.value, lang.value))
const expCats = computed(() => byCategory(periodTx.value, 'expense', categories.value, t('common.uncategorized')))
const recent = computed(() => transactions.value.slice(0, 6))
const rangeLabel = computed(() => {
  const { from, to } = range.value
  return from === to ? formatDate(from, lang.value) : `${formatDate(from, lang.value)} – ${formatDate(to, lang.value)}`
})

const walletIcons: Record<WalletType, any> = { cash: Banknote, bank: Landmark, e_wallet: Smartphone, other: WalletIcon }
const walletHint = computed(() => `${activeWallets.value.length} ${t('dash.wallets')}`)

// Warna dataset: ChartCanvas mengubahnya menjadi gradien.
const barSets = computed(() => [
  { label: t('common.income'), data: series.value.income, backgroundColor: '#1fa66a', borderRadius: 8, maxBarThickness: 18 },
  { label: t('common.expense'), data: series.value.expense, backgroundColor: '#ef6a6a', borderRadius: 8, maxBarThickness: 18 }
])
const lineSets = computed(() => [
  { label: t('common.expense'), data: series.value.expense, borderColor: '#ef6a6a', backgroundColor: 'rgba(239,106,106,0.12)', fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5 }
])
const donutSets = computed(() => [{ data: expCats.value.map(c => c.total), backgroundColor: expCats.value.map(c => c.color), borderWidth: 0 }])

function goCategory(c: { id: string }) {
  if (!c.id) return
  router.push({ path: '/transactions', query: { category: c.id, type: 'expense', from: range.value.from, to: range.value.to } })
}
</script>

<template>
  <div>
    <div class="rise-in mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <p class="eyebrow mb-2.5"><span class="status-dot" />Overview</p>
        <h1 class="text-2xl font-extrabold tracking-[-0.03em] sm:text-[28px]">{{ t('nav.dashboard') }}</h1>
        <p class="num mt-1 truncate text-sm text-muted">{{ rangeLabel }}</p>
      </div>
      <PeriodFilter v-model:preset="preset" v-model:custom="custom" />
    </div>

    <div v-if="!ready" class="space-y-4">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4"><SkeletonBlock v-for="n in 4" :key="n" class="h-28" /></div>
      <div class="grid gap-4 lg:grid-cols-3"><SkeletonBlock class="h-72 lg:col-span-2" /><SkeletonBlock class="h-72" /></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard hero class="col-span-2 lg:col-span-1" :label="t('dash.totalBalance')" :value="money(totalBalance)" :hint="walletHint" :icon="WalletIcon" />
        <SummaryCard :label="t('dash.income')" :value="money(totals.income)" tone="income" :icon="ArrowDownLeft" />
        <SummaryCard :label="t('dash.expense')" :value="money(totals.expense)" tone="expense" :icon="ArrowUpRight" />
        <SummaryCard class="col-span-2 lg:col-span-1" :label="t('dash.net')" :value="money(totals.net)" :tone="totals.net < 0 ? 'expense' : 'transfer'" :icon="Scale" />
      </div>

      <EmptyState v-if="!hasAny" class="mt-5" :title="t('dash.emptyTitle')" :text="t('dash.emptyText')" :icon="Receipt">
        <button class="btn-primary" @click="open()"><Plus class="h-4 w-4" />{{ t('tx.add') }}</button>
      </EmptyState>

      <div v-else class="mt-5 grid gap-4 lg:grid-cols-3">
        <section class="card glow-corner min-w-0 p-5 lg:col-span-2">
          <div class="mb-4 flex items-center gap-2.5">
            <span class="panel-icon bg-income/15 text-income"><BarChart3 class="h-[18px] w-[18px]" /></span>
            <h2 class="text-sm font-bold tracking-tight">{{ t('dash.incomeVsExpense') }}</h2>
          </div>
          <div v-if="hasPeriod" class="h-60"><ChartCanvas type="bar" :labels="series.labels" :datasets="barSets" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>

        <section class="card min-w-0 p-5">
          <div class="mb-4 flex items-center gap-2.5">
            <span class="panel-icon bg-transfer/15 text-transfer"><PieChart class="h-[18px] w-[18px]" /></span>
            <h2 class="text-sm font-bold tracking-tight">{{ t('dash.expenseByCategory') }}</h2>
          </div>
          <div v-if="expCats.length" class="h-60"><ChartCanvas type="doughnut" :labels="expCats.map(c => c.name)" :datasets="donutSets" @select="i => goCategory(expCats[i])" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>

        <section class="card min-w-0 p-5 lg:col-span-2">
          <div class="mb-4 flex items-center gap-2.5">
            <span class="panel-icon bg-expense/15 text-expense"><TrendingDown class="h-[18px] w-[18px]" /></span>
            <h2 class="text-sm font-bold tracking-tight">{{ t('dash.expenseTrend') }}</h2>
          </div>
          <div v-if="hasPeriod" class="h-60"><ChartCanvas type="line" :labels="series.labels" :datasets="lineSets" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>

        <section class="card min-w-0 p-5">
          <div class="mb-4 flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <span class="panel-icon bg-accent/10 text-accent"><WalletIcon class="h-[18px] w-[18px]" /></span>
              <h2 class="truncate text-sm font-bold tracking-tight">{{ t('dash.wallets') }}</h2>
            </div>
            <NuxtLink to="/wallets" class="shrink-0 text-xs font-bold text-accent hover:underline">{{ t('common.viewAll') }}</NuxtLink>
          </div>
          <ul class="space-y-2.5">
            <li v-for="w in activeWallets" :key="w.id" class="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg/50 p-2.5 text-sm transition hover:border-accent/30">
              <span class="flex min-w-0 items-center gap-2.5">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-[11px]" :style="{ color: safeColor(w.color), backgroundColor: `color-mix(in srgb, ${safeColor(w.color)} 15%, transparent)` }">
                  <component :is="walletIcons[w.type] ?? WalletIcon" class="h-[17px] w-[17px]" />
                </span>
                <span class="truncate font-semibold">{{ w.name }}</span>
              </span>
              <span class="num shrink-0 font-bold">{{ money(walletBalance(w)) }}</span>
            </li>
          </ul>
        </section>

        <section class="min-w-0 lg:col-span-2">
          <div class="mb-3 flex items-center justify-between px-1">
            <div class="flex items-center gap-2.5">
              <span class="panel-icon bg-accent/10 text-accent"><Receipt class="h-[18px] w-[18px]" /></span>
              <h2 class="text-sm font-bold tracking-tight">{{ t('dash.recent') }}</h2>
            </div>
            <NuxtLink to="/transactions" class="text-xs font-bold text-accent hover:underline">{{ t('common.viewAll') }}</NuxtLink>
          </div>
          <TransactionList :items="recent" readonly />
        </section>

        <section class="card h-fit min-w-0 p-5">
          <div class="mb-4 flex items-center gap-2.5">
            <span class="panel-icon bg-[#f59e0b]/15 text-[#d98a06]"><Trophy class="h-[18px] w-[18px]" /></span>
            <h2 class="text-sm font-bold tracking-tight">{{ t('dash.topCategories') }}</h2>
          </div>
          <CategoryBreakdown v-if="expCats.length" :items="expCats.slice(0, 5)" @select="goCategory" />
          <p v-else class="py-6 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>
      </div>
    </template>
  </div>
</template>
