<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight, Plus, Receipt, Scale, Wallet as WalletIcon } from 'lucide-vue-next'

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

const barSets = computed(() => [
  { label: t('common.income'), data: series.value.income, backgroundColor: '#22c55e', borderRadius: 4, maxBarThickness: 18 },
  { label: t('common.expense'), data: series.value.expense, backgroundColor: '#ef6a6a', borderRadius: 4, maxBarThickness: 18 }
])
const lineSets = computed(() => [
  { label: t('common.expense'), data: series.value.expense, borderColor: '#ef6a6a', backgroundColor: 'rgba(239,106,106,0.12)', fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 }
])
const donutSets = computed(() => [{ data: expCats.value.map(c => c.total), backgroundColor: expCats.value.map(c => c.color), borderWidth: 0 }])

function goCategory(c: { id: string }) {
  if (!c.id) return
  router.push({ path: '/transactions', query: { category: c.id, type: 'expense', from: range.value.from, to: range.value.to } })
}
</script>

<template>
  <div>
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold tracking-tight">{{ t('nav.dashboard') }}</h1>
        <p class="truncate text-sm text-muted">{{ rangeLabel }}</p>
      </div>
      <PeriodFilter v-model:preset="preset" v-model:custom="custom" />
    </div>

    <div v-if="!ready" class="space-y-4">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4"><SkeletonBlock v-for="n in 4" :key="n" class="h-24" /></div>
      <div class="grid gap-4 lg:grid-cols-3"><SkeletonBlock class="h-64 lg:col-span-2" /><SkeletonBlock class="h-64" /></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard class="col-span-2 lg:col-span-1" :label="t('dash.totalBalance')" :value="money(totalBalance)" :icon="WalletIcon" />
        <SummaryCard :label="t('dash.income')" :value="money(totals.income)" tone="income" :icon="ArrowDownLeft" />
        <SummaryCard :label="t('dash.expense')" :value="money(totals.expense)" tone="expense" :icon="ArrowUpRight" />
        <SummaryCard :label="t('dash.net')" :value="money(totals.net)" :tone="totals.net < 0 ? 'expense' : 'income'" :icon="Scale" />
      </div>

      <EmptyState v-if="!hasAny" class="mt-5" :title="t('dash.emptyTitle')" :text="t('dash.emptyText')" :icon="Receipt">
        <button class="btn-primary" @click="open()"><Plus class="h-4 w-4" />{{ t('tx.add') }}</button>
      </EmptyState>

      <div v-else class="mt-5 grid gap-4 lg:grid-cols-3">
        <section class="card min-w-0 p-4 lg:col-span-2">
          <h2 class="mb-3 text-sm font-medium">{{ t('dash.incomeVsExpense') }}</h2>
          <div v-if="hasPeriod" class="h-56"><ChartCanvas type="bar" :labels="series.labels" :datasets="barSets" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>

        <section class="card min-w-0 p-4">
          <h2 class="mb-3 text-sm font-medium">{{ t('dash.expenseByCategory') }}</h2>
          <div v-if="expCats.length" class="h-56"><ChartCanvas type="doughnut" :labels="expCats.map(c => c.name)" :datasets="donutSets" @select="i => goCategory(expCats[i])" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>

        <section class="card min-w-0 p-4 lg:col-span-2">
          <h2 class="mb-3 text-sm font-medium">{{ t('dash.expenseTrend') }}</h2>
          <div v-if="hasPeriod" class="h-56"><ChartCanvas type="line" :labels="series.labels" :datasets="lineSets" /></div>
          <p v-else class="py-16 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>

        <section class="card min-w-0 p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-medium">{{ t('dash.wallets') }}</h2>
            <NuxtLink to="/wallets" class="text-xs text-accent hover:underline">{{ t('common.viewAll') }}</NuxtLink>
          </div>
          <ul class="space-y-3">
            <li v-for="w in activeWallets" :key="w.id" class="flex items-center justify-between gap-3 text-sm">
              <span class="flex min-w-0 items-center gap-2">
                <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: safeColor(w.color) }" />
                <span class="truncate">{{ w.name }}</span>
              </span>
              <span class="num shrink-0 font-medium">{{ money(walletBalance(w)) }}</span>
            </li>
          </ul>
        </section>

        <section class="min-w-0 lg:col-span-2">
          <div class="mb-2 flex items-center justify-between px-1">
            <h2 class="text-sm font-medium">{{ t('dash.recent') }}</h2>
            <NuxtLink to="/transactions" class="text-xs text-accent hover:underline">{{ t('common.viewAll') }}</NuxtLink>
          </div>
          <TransactionList :items="recent" readonly />
        </section>

        <section class="card h-fit min-w-0 p-4">
          <h2 class="mb-3 text-sm font-medium">{{ t('dash.topCategories') }}</h2>
          <CategoryBreakdown v-if="expCats.length" :items="expCats.slice(0, 5)" @select="goCategory" />
          <p v-else class="py-6 text-center text-sm text-muted">{{ t('common.noDataPeriod') }}</p>
        </section>
      </div>
    </template>
  </div>
</template>
