<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
const { t } = useT()
const { user } = useAuth()
const { wallets, balanceViewMissing, ensureLoaded } = useData()
const toast = useToast()
const router = useRouter()

async function boot() {
  if (!user.value) return
  try {
    await ensureLoaded()
    if (!wallets.value.length) await router.replace('/welcome')
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  }
}
onMounted(boot)
watch(() => user.value?.id, boot)
</script>

<template>
  <div class="relative isolate min-h-screen bg-bg text-fg">
    <div class="app-ambient" aria-hidden="true"><span /><span /><span /></div>
    <AppSidebar />
    <div class="md:pl-16 lg:pl-56">
      <AppNavbar />
      <main class="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:px-6 md:pb-10">
        <div v-if="balanceViewMissing" class="mb-4 flex items-start gap-3 rounded-2xl border border-expense/30 bg-expense/10 p-3.5 text-sm">
          <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-expense" />
          <span>{{ t('banner.balanceView') }}</span>
        </div>
        <slot />
      </main>
    </div>
    <BottomNav />
    <TransactionFormModal />
    <LogoutConfirmModal />
  </div>
</template>
