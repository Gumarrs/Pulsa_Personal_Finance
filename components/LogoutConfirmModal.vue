<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

const { t } = useT()
const { open } = useLogoutConfirm()
const { signOut } = useAuth()
const toast = useToast()
const busy = ref(false)

// Pastikan tombol tidak terkunci bila dialog dibuka lagi setelah gagal keluar.
watch(open, v => { if (v) busy.value = false })

async function confirm() {
  if (busy.value) return
  busy.value = true
  try {
    await signOut()
    open.value = false
  } catch (e: any) {
    busy.value = false
    toast.error(e?.message || t('common.error'))
  }
}
</script>

<template>
  <BaseModal v-model="open" :title="t('logout.title')">
    <div class="flex flex-col items-center px-1 py-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
      <span class="mb-4 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-expense/15 text-expense sm:mb-0">
        <LogOut class="h-6 w-6" />
      </span>
      <p class="text-sm leading-relaxed text-muted">{{ t('logout.text') }}</p>
    </div>
    <template #footer>
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button class="btn-secondary" :disabled="busy" @click="open = false">{{ t('logout.stay') }}</button>
        <button class="btn-danger" :disabled="busy" @click="confirm">
          <LogOut class="h-4 w-4" />{{ busy ? t('common.loading') : t('logout.confirm') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
