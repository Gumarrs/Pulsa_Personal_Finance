<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useT()
const { ensureLoaded, wallets } = useData()
const { ask: askLogout } = useLogoutConfirm()
const router = useRouter()
const toast = useToast()

onMounted(async () => {
  try {
    await ensureLoaded()
    if (wallets.value.length) await router.replace('/')
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  }
})
</script>

<template>
  <div class="relative isolate flex min-h-screen min-h-[100dvh] items-center justify-center overflow-hidden bg-bg px-5 py-12">
    <div class="app-ambient" aria-hidden="true"><span /><span /><span /></div>

    <div class="rise-in w-full max-w-md">
      <div class="mb-8 flex justify-center"><BrandMark /></div>

      <div class="card glow-corner p-7 sm:p-9">
        <p class="eyebrow mb-3.5"><span class="status-dot" />Let's get started</p>
        <h1 class="text-[26px] font-extrabold leading-tight tracking-[-0.03em]">{{ t('welcome.title') }}</h1>
        <p class="mt-2.5 text-sm leading-relaxed text-muted">{{ t('welcome.text') }}</p>
        <div class="mt-6"><WalletForm @saved="router.replace('/')" /></div>
      </div>

      <button class="mt-6 w-full text-center text-xs font-semibold text-muted transition hover:text-accent" @click="askLogout()">{{ t('settings.logout') }}</button>
    </div>

    <LogoutConfirmModal />
  </div>
</template>
