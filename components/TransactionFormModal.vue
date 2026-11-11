<script setup lang="ts">
import type { TxType } from '~/types'

const { t, lang } = useT()
const { state, close } = useTxModal()
const { activeWallets, wallets, categories, saveTransaction } = useData()
const { timezone, currency } = usePrefs()
const toast = useToast()

const types: TxType[] = ['expense', 'income', 'transfer']
const toneText: Record<TxType, string> = { income: 'text-income', expense: 'text-expense', transfer: 'text-transfer' }
const form = reactive({ type: 'expense' as TxType, amount: '', category_id: '', wallet_id: '', to_wallet_id: '', description: '', date: '' })
const errors = reactive<Record<string, string>>({})
const saving = ref(false)
const editing = computed(() => state.value.tx)
const symbol = computed(() => (currency.value === 'IDR' ? 'Rp' : currency.value))
const amountDisplay = computed(() => (form.amount ? Number(form.amount).toLocaleString(lang.value === 'id' ? 'id-ID' : 'en-US') : ''))

const categoryOptions = computed(() =>
  categories.value.filter(c => c.type === form.type && (!c.is_archived || c.id === form.category_id))
)
const walletOptions = computed(() =>
  wallets.value.filter(w => !w.is_archived || w.id === form.wallet_id || w.id === form.to_wallet_id)
)

function clearErrors() {
  Object.keys(errors).forEach(k => delete errors[k])
}

watch(
  () => state.value.open,
  (o) => {
    if (!o) return
    clearErrors()
    const tx = state.value.tx
    if (tx) {
      Object.assign(form, {
        type: tx.type,
        amount: String(tx.amount),
        category_id: tx.category_id ?? '',
        wallet_id: tx.wallet_id,
        to_wallet_id: tx.to_wallet_id ?? '',
        description: tx.description ?? '',
        date: tx.transaction_date
      })
    } else {
      Object.assign(form, {
        type: 'expense',
        amount: '',
        category_id: '',
        wallet_id: activeWallets.value[0]?.id ?? '',
        to_wallet_id: '',
        description: '',
        date: todayStr(timezone.value)
      })
    }
  }
)

function setType(tp: TxType) {
  form.type = tp
  form.category_id = ''
  if (tp !== 'transfer') form.to_wallet_id = ''
  clearErrors()
}

function onAmount(e: Event) {
  const el = e.target as HTMLInputElement
  form.amount = sanitizeAmount(el.value)
  el.value = amountDisplay.value
}

function validate() {
  const e: Record<string, string> = {}
  if (!(Number(form.amount) > 0)) e.amount = t('val.amount')
  if (!form.wallet_id) e.wallet_id = t('val.wallet')
  if (form.type === 'transfer') {
    if (!form.to_wallet_id) e.to_wallet_id = t('val.wallet')
    else if (form.to_wallet_id === form.wallet_id) e.to_wallet_id = t('val.sameWallet')
  } else if (!form.category_id) e.category_id = t('val.category')
  if (!form.date) e.date = t('val.date')
  clearErrors()
  Object.assign(errors, e)
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  saving.value = true
  const isEdit = Boolean(editing.value)
  try {
    await saveTransaction(
      {
        type: form.type,
        amount: Number(form.amount),
        category_id: form.type === 'transfer' ? null : form.category_id,
        wallet_id: form.wallet_id,
        to_wallet_id: form.type === 'transfer' ? form.to_wallet_id : null,
        description: form.description.trim() || null,
        transaction_date: form.date
      },
      editing.value?.id
    )
    toast.success(t(isEdit ? 'tx.updated' : 'tx.created'))
    close()
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  } finally {
    saving.value = false
  }
}

function onModel(v: boolean) {
  if (!v) close()
}
</script>

<template>
  <BaseModal :model-value="state.open" :title="editing ? t('tx.edit') : t('tx.add')" @update:model-value="onModel">
    <form id="tx-form" class="space-y-4" @submit.prevent="submit">
      <div class="grid grid-cols-3 gap-1 rounded-xl bg-soft p-1">
        <button
          v-for="tp in types"
          :key="tp"
          type="button"
          class="rounded-lg py-2 text-sm font-medium transition"
          :class="form.type === tp ? ['bg-surface shadow-sm', toneText[tp]] : 'text-muted'"
          @click="setType(tp)"
        >
          {{ t('type.' + tp) }}
        </button>
      </div>

      <div>
        <label class="label">{{ t('tx.amount') }}</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">{{ symbol }}</span>
          <input class="input num h-12 pl-12 text-lg font-semibold" inputmode="numeric" autocomplete="off" placeholder="0" :value="amountDisplay" @input="onAmount" />
        </div>
        <p v-if="errors.amount" class="err">{{ errors.amount }}</p>
      </div>

      <div v-if="form.type !== 'transfer'">
        <label class="label">{{ t('tx.category') }}</label>
        <select v-model="form.category_id" class="input">
          <option value="">{{ t('tx.selectCategory') }}</option>
          <option v-for="c in categoryOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <p v-if="errors.category_id" class="err">{{ errors.category_id }}</p>
      </div>

      <div>
        <label class="label">{{ form.type === 'income' ? t('tx.walletDest') : t('tx.walletSource') }}</label>
        <select v-model="form.wallet_id" class="input">
          <option value="">{{ t('tx.selectWallet') }}</option>
          <option v-for="w in walletOptions" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
        <p v-if="errors.wallet_id" class="err">{{ errors.wallet_id }}</p>
      </div>

      <div v-if="form.type === 'transfer'">
        <label class="label">{{ t('tx.walletDest') }}</label>
        <select v-model="form.to_wallet_id" class="input">
          <option value="">{{ t('tx.selectWallet') }}</option>
          <option v-for="w in walletOptions" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
        <p v-if="errors.to_wallet_id" class="err">{{ errors.to_wallet_id }}</p>
      </div>

      <div>
        <label class="label">{{ t('tx.description') }} ({{ t('common.optional') }})</label>
        <input v-model="form.description" class="input" maxlength="200" :placeholder="t('tx.descPlaceholder')" />
      </div>

      <div>
        <label class="label">{{ t('tx.date') }}</label>
        <input v-model="form.date" type="date" class="input" />
        <p v-if="errors.date" class="err">{{ errors.date }}</p>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button type="button" class="btn-secondary" @click="close()">{{ t('common.cancel') }}</button>
        <button type="submit" form="tx-form" class="btn-primary" :disabled="saving">{{ saving ? t('common.saving') : t('common.save') }}</button>
      </div>
    </template>
  </BaseModal>
</template>
