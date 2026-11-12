<script setup lang="ts">
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Pencil, Trash2 } from 'lucide-vue-next'
import type { Transaction, TxType } from '~/types'

const props = defineProps<{ items: Transaction[]; readonly?: boolean }>()
defineEmits<{ (e: 'edit', tx: Transaction): void; (e: 'delete', tx: Transaction): void }>()
const { t, lang } = useT()
const { money } = useMoney()
const { categories, wallets } = useData()
const { timezone } = usePrefs()

const icons: Record<TxType, any> = { income: ArrowDownLeft, expense: ArrowUpRight, transfer: ArrowLeftRight }
const tone: Record<TxType, string> = { income: 'bg-income/15 text-income', expense: 'bg-expense/15 text-expense', transfer: 'bg-transfer/15 text-transfer' }
const amountTone: Record<TxType, string> = { income: 'text-income', expense: 'text-expense', transfer: 'text-transfer' }

const catName = (id: string | null) => categories.value.find(c => c.id === id)?.name ?? t('common.uncategorized')
const walletName = (id: string | null) => wallets.value.find(w => w.id === id)?.name ?? '—'
const title = (x: Transaction) => x.description || (x.type === 'transfer' ? t('type.transfer') : catName(x.category_id))
const meta = (x: Transaction) =>
  x.type === 'transfer' ? `${walletName(x.wallet_id)} → ${walletName(x.to_wallet_id)}` : `${catName(x.category_id)} · ${walletName(x.wallet_id)}`
const sign = (x: Transaction) => (x.type === 'income' ? '+' : x.type === 'expense' ? '-' : '')

const groups = computed(() => {
  const out: { date: string; rows: Transaction[] }[] = []
  for (const x of props.items) {
    const last = out[out.length - 1]
    if (last && last.date === x.transaction_date) last.rows.push(x)
    else out.push({ date: x.transaction_date, rows: [x] })
  }
  return out
})

function dateLabel(d: string) {
  const today = todayStr(timezone.value)
  if (d === today) return t('common.today')
  if (d === addDays(today, -1)) return t('common.yesterday')
  return formatDate(d, lang.value, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-5">
    <section v-for="g in groups" :key="g.date">
      <h3 class="mb-2 flex items-center gap-2 px-1 text-xs font-semibold text-muted">
        <span class="h-1.5 w-1.5 rounded-full bg-accent/70" />{{ dateLabel(g.date) }}
      </h3>
      <ul class="card divide-y divide-line overflow-hidden">
        <li v-for="x in g.rows" :key="x.id" class="flex items-center gap-3 px-3 py-3 transition hover:bg-soft/60 sm:px-4">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl" :class="tone[x.type]">
            <component :is="icons[x.type]" class="h-[18px] w-[18px]" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ title(x) }}</p>
            <p class="truncate text-xs text-muted">{{ meta(x) }}</p>
          </div>
          <span class="hidden rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:inline" :class="tone[x.type]">{{ t('type.' + x.type) }}</span>
          <span class="num shrink-0 text-sm font-bold" :class="amountTone[x.type]">{{ sign(x) }}{{ money(x.amount) }}</span>
          <div v-if="!readonly" class="flex shrink-0 items-center">
            <button class="btn-ghost h-8 w-8 p-0" :aria-label="t('common.edit')" @click="$emit('edit', x)"><Pencil class="h-3.5 w-3.5" /></button>
            <button class="btn-ghost h-8 w-8 p-0 hover:text-expense" :aria-label="t('common.delete')" @click="$emit('delete', x)"><Trash2 class="h-3.5 w-3.5" /></button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
