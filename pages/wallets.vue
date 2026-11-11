<script setup lang="ts">
import { Archive, ArchiveRestore, Banknote, Landmark, Pencil, Plus, Smartphone, Wallet as WalletIcon } from 'lucide-vue-next'
import type { Wallet, WalletType } from '~/types'

const { t } = useT()
const { money } = useMoney()
const { wallets, totalBalance, walletBalance, loadedFor, setWalletArchived } = useData()
const toast = useToast()

const icons: Record<WalletType, any> = { cash: Banknote, bank: Landmark, e_wallet: Smartphone, other: WalletIcon }
const ready = computed(() => Boolean(loadedFor.value))
const showArchived = ref(false)
const shown = computed(() => wallets.value.filter(w => showArchived.value || !w.is_archived))
const archivedCount = computed(() => wallets.value.filter(w => w.is_archived).length)

const formOpen = ref(false)
const editing = ref<Wallet | null>(null)
function openForm(w: Wallet | null = null) {
  editing.value = w
  formOpen.value = true
}

const toArchive = ref<Wallet | null>(null)
const busy = ref(false)
async function archive() {
  if (!toArchive.value) return
  busy.value = true
  try {
    await setWalletArchived(toArchive.value.id, true)
    toast.success(t('wallet.archivedMsg'))
    toArchive.value = null
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  } finally {
    busy.value = false
  }
}
async function restore(w: Wallet) {
  try {
    await setWalletArchived(w.id, false)
    toast.success(t('wallet.restored'))
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  }
}
function onArchiveModel(v: boolean) {
  if (!v) toArchive.value = null
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold tracking-tight">{{ t('wallet.title') }}</h1>
        <p class="num truncate text-sm text-muted">{{ t('wallet.total') }}: {{ money(totalBalance) }}</p>
      </div>
      <button class="btn-primary shrink-0" @click="openForm()"><Plus class="h-4 w-4" /><span class="hidden sm:inline">{{ t('wallet.add') }}</span></button>
    </div>

    <div v-if="!ready" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><SkeletonBlock v-for="n in 3" :key="n" class="h-36" /></div>
    <template v-else>
      <EmptyState v-if="!shown.length" :title="t('wallet.emptyTitle')" :text="t('wallet.emptyText')" :icon="WalletIcon">
        <button class="btn-primary" @click="openForm()"><Plus class="h-4 w-4" />{{ t('wallet.add') }}</button>
      </EmptyState>
      <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="w in shown" :key="w.id" class="card min-w-0 p-4" :class="w.is_archived ? 'opacity-60' : ''">
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 items-center gap-3">
              <span
                class="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                :style="{ color: safeColor(w.color), backgroundColor: `color-mix(in srgb, ${safeColor(w.color)} 14%, transparent)` }"
              >
                <component :is="icons[w.type] ?? WalletIcon" class="h-5 w-5" />
              </span>
              <div class="min-w-0">
                <p class="truncate font-medium">{{ w.name }}</p>
                <p class="text-xs text-muted">{{ t('wallet.type.' + w.type) }}<template v-if="w.is_archived"> · {{ t('wallet.archived') }}</template></p>
              </div>
            </div>
            <div class="flex shrink-0">
              <button class="btn-ghost h-8 w-8 p-0" :aria-label="t('common.edit')" @click="openForm(w)"><Pencil class="h-3.5 w-3.5" /></button>
              <button v-if="!w.is_archived" class="btn-ghost h-8 w-8 p-0" :aria-label="t('wallet.archive')" @click="toArchive = w"><Archive class="h-3.5 w-3.5" /></button>
              <button v-else class="btn-ghost h-8 w-8 p-0" :aria-label="t('wallet.restore')" @click="restore(w)"><ArchiveRestore class="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <p class="num mt-4 truncate text-2xl font-semibold tracking-tight">{{ money(walletBalance(w)) }}</p>
          <NuxtLink :to="{ path: '/transactions', query: { wallet: w.id } }" class="mt-3 inline-block text-xs text-accent hover:underline">{{ t('wallet.viewTx') }}</NuxtLink>
        </div>
      </div>
      <button v-if="archivedCount" class="mt-4 text-xs text-muted hover:text-fg" @click="showArchived = !showArchived">
        {{ showArchived ? t('wallet.hideArchived') : t('wallet.showArchived', { n: archivedCount }) }}
      </button>
    </template>

    <WalletFormModal v-model="formOpen" :wallet="editing" />
    <ConfirmDialog
      :model-value="Boolean(toArchive)"
      :title="t('wallet.archiveTitle')"
      :text="t('wallet.archiveText')"
      :confirm-label="t('wallet.archive')"
      :loading="busy"
      @update:model-value="onArchiveModel"
      @confirm="archive"
    />
  </div>
</template>
