<script setup lang="ts">
import { Banknote, Landmark, Smartphone, Wallet as WalletIcon } from 'lucide-vue-next'
import type { Wallet, WalletType } from '~/types'

const props = defineProps<{ wallet?: Wallet | null; showCancel?: boolean }>()
const emit = defineEmits<{ (e: 'saved'): void; (e: 'cancel'): void }>()
const { t, lang } = useT()
const { createWallet, updateWallet } = useData()
const { currency } = usePrefs()
const toast = useToast()

const types: { v: WalletType; icon: any }[] = [
  { v: 'cash', icon: Banknote },
  { v: 'bank', icon: Landmark },
  { v: 'e_wallet', icon: Smartphone },
  { v: 'other', icon: WalletIcon }
]
const form = reactive({
  name: props.wallet?.name ?? '',
  type: (props.wallet?.type ?? 'cash') as WalletType,
  balance: props.wallet ? String(props.wallet.initial_balance) : '',
  color: safeColor(props.wallet?.color, 0)
})
const nameError = ref('')
const saving = ref(false)
const symbol = computed(() => (currency.value === 'IDR' ? 'Rp' : currency.value))
const balanceDisplay = computed(() => {
  if (!form.balance) return ''
  const n = Number(form.balance)
  return Number.isFinite(n) ? n.toLocaleString(lang.value === 'id' ? 'id-ID' : 'en-US') : form.balance
})

function onBalance(e: Event) {
  const el = e.target as HTMLInputElement
  form.balance = sanitizeAmount(el.value)
  el.value = balanceDisplay.value
}

async function submit() {
  nameError.value = form.name.trim() ? '' : t('val.name')
  if (nameError.value) return
  saving.value = true
  const input = { name: form.name.trim(), type: form.type, initial_balance: Number(form.balance) || 0, color: form.color }
  try {
    if (props.wallet) await updateWallet(props.wallet.id, input)
    else await createWallet(input)
    toast.success(t(props.wallet ? 'wallet.updated' : 'wallet.created'))
    emit('saved')
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label class="label">{{ t('wallet.name') }}</label>
      <input v-model="form.name" class="input" maxlength="60" :placeholder="t('wallet.namePlaceholder')" />
      <p v-if="nameError" class="err">{{ nameError }}</p>
    </div>
    <div>
      <label class="label">{{ t('wallet.type') }}</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="x in types"
          :key="x.v"
          type="button"
          class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition"
          :class="form.type === x.v ? 'border-accent bg-accent/10 font-medium' : 'border-line text-muted hover:bg-soft'"
          @click="form.type = x.v"
        >
          <component :is="x.icon" class="h-4 w-4" />{{ t('wallet.type.' + x.v) }}
        </button>
      </div>
    </div>
    <div>
      <label class="label">{{ t('wallet.initial') }}</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">{{ symbol }}</span>
        <input class="input num pl-12" inputmode="numeric" autocomplete="off" placeholder="0" :value="balanceDisplay" @input="onBalance" />
      </div>
    </div>
    <div>
      <label class="label">{{ t('wallet.color') }}</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in PALETTE"
          :key="c"
          type="button"
          class="h-7 w-7 rounded-full ring-offset-2 ring-offset-surface transition"
          :class="form.color === c ? 'ring-2 ring-fg' : ''"
          :style="{ backgroundColor: c }"
          :aria-label="c"
          @click="form.color = c"
        />
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-1">
      <button v-if="showCancel" type="button" class="btn-secondary" @click="emit('cancel')">{{ t('common.cancel') }}</button>
      <button type="submit" class="btn-primary" :class="showCancel ? '' : 'w-full'" :disabled="saving">{{ saving ? t('common.saving') : t('common.save') }}</button>
    </div>
  </form>
</template>
