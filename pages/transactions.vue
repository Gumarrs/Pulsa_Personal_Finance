<script setup lang="ts">
import { Plus, Receipt, Search } from 'lucide-vue-next'
import type { Transaction } from '~/types'

const { t } = useT()
const { money } = useMoney()
const route = useRoute()
const { transactions, categories, wallets, loadedFor, deleteTransaction } = useData()
const { open } = useTxModal()
const toast = useToast()

const q = route.query
const f = reactive({
  q: '',
  type: ['income', 'expense', 'transfer'].includes(String(q.type)) ? String(q.type) : 'all',
  category: String(q.category || ''),
  wallet: String(q.wallet || ''),
  from: String(q.from || ''),
  to: String(q.to || '')
})
const limit = ref(50)
watch(f, () => { limit.value = 50 })

const ready = computed(() => Boolean(loadedFor.value))
const categoryName = (id: string | null) => categories.value.find(c => c.id === id)?.name ?? ''
const walletName = (id: string | null) => wallets.value.find(w => w.id === id)?.name ?? ''
const categoryOptions = computed(() => categories.value.filter(c => f.type === 'all' || f.type === 'transfer' ? true : c.type === f.type))

const filtered = computed(() => {
  const s = f.q.trim().toLowerCase()
  return transactions.value.filter((x) => {
    if (f.type !== 'all' && x.type !== f.type) return false
    if (f.category && x.category_id !== f.category) return false
    if (f.wallet && x.wallet_id !== f.wallet && x.to_wallet_id !== f.wallet) return false
    if (f.from && x.transaction_date < f.from) return false
    if (f.to && x.transaction_date > f.to) return false
    if (s) {
      const hay = [x.description, categoryName(x.category_id), walletName(x.wallet_id), walletName(x.to_wallet_id)].join(' ').toLowerCase()
      if (!hay.includes(s)) return false
    }
    return true
  })
})
const visible = computed(() => filtered.value.slice(0, limit.value))
const sums = computed(() => summarize(filtered.value))
const hasFilters = computed(() => Boolean(f.q || f.type !== 'all' || f.category || f.wallet || f.from || f.to))

function clearFilters() {
  Object.assign(f, { q: '', type: 'all', category: '', wallet: '', from: '', to: '' })
}

const toDelete = ref<Transaction | null>(null)
const deleting = ref(false)
async function confirmDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await deleteTransaction(toDelete.value.id)
    toast.success(t('tx.deleted'))
    toDelete.value = null
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  } finally {
    deleting.value = false
  }
}
function onDeleteModel(v: boolean) {
  if (!v) toDelete.value = null
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold tracking-tight">{{ t('tx.title') }}</h1>
        <p class="num truncate text-sm text-muted">
          {{ t('tx.count', { n: filtered.length }) }} ·
          <span class="text-income">+{{ money(sums.income) }}</span> ·
          <span class="text-expense">-{{ money(sums.expense) }}</span>
        </p>
      </div>
      <button class="btn-primary shrink-0" @click="open()"><Plus class="h-4 w-4" /><span class="hidden sm:inline">{{ t('tx.add') }}</span></button>
    </div>

    <div class="card mb-5 grid grid-cols-2 gap-3 p-3 md:grid-cols-6">
      <div class="relative col-span-2 md:col-span-6">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input v-model="f.q" class="input pl-9" :placeholder="t('tx.searchPlaceholder')" />
      </div>
      <select v-model="f.type" class="input md:col-span-1">
        <option value="all">{{ t('tx.allTypes') }}</option>
        <option value="income">{{ t('type.income') }}</option>
        <option value="expense">{{ t('type.expense') }}</option>
        <option value="transfer">{{ t('type.transfer') }}</option>
      </select>
      <select v-model="f.category" class="input md:col-span-2">
        <option value="">{{ t('tx.allCategories') }}</option>
        <option v-for="c in categoryOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="f.wallet" class="input md:col-span-1">
        <option value="">{{ t('tx.allWallets') }}</option>
        <option v-for="w in wallets" :key="w.id" :value="w.id">{{ w.name }}</option>
      </select>
      <div class="col-span-2 flex items-center gap-2 md:col-span-2">
        <input v-model="f.from" type="date" class="input min-w-0 flex-1 text-xs" :aria-label="t('tx.from')" />
        <span class="text-muted">–</span>
        <input v-model="f.to" type="date" class="input min-w-0 flex-1 text-xs" :aria-label="t('tx.to')" />
      </div>
      <button v-if="hasFilters" class="col-span-2 text-left text-xs text-accent hover:underline md:col-span-6" @click="clearFilters">{{ t('tx.clear') }}</button>
    </div>

    <div v-if="!ready" class="space-y-3"><SkeletonBlock v-for="n in 5" :key="n" class="h-16" /></div>
    <template v-else>
      <EmptyState v-if="!transactions.length" :title="t('tx.emptyTitle')" :text="t('tx.emptyText')" :icon="Receipt">
        <button class="btn-primary" @click="open()"><Plus class="h-4 w-4" />{{ t('tx.add') }}</button>
      </EmptyState>
      <EmptyState v-else-if="!filtered.length" :title="t('tx.noMatch')" :icon="Search">
        <button class="btn-secondary" @click="clearFilters">{{ t('tx.clear') }}</button>
      </EmptyState>
      <template v-else>
        <TransactionList :items="visible" @edit="open($event)" @delete="toDelete = $event" />
        <div v-if="filtered.length > limit" class="mt-4 text-center">
          <button class="btn-secondary" @click="limit += 50">{{ t('tx.loadMore') }}</button>
        </div>
      </template>
    </template>

    <ConfirmDialog
      :model-value="Boolean(toDelete)"
      :title="t('tx.deleteTitle')"
      :text="t('tx.deleteText')"
      :confirm-label="t('common.delete')"
      :loading="deleting"
      @update:model-value="onDeleteModel"
      @confirm="confirmDelete"
    />
  </div>
</template>
