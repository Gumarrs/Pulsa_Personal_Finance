<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useT()
const { ensureLoaded, wallets } = useData()
const { signOut } = useAuth()
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
  <div class="card p-6">
    <h1 class="text-lg font-semibold">{{ t('welcome.title') }}</h1>
    <p class="mt-1 text-sm text-muted">{{ t('welcome.text') }}</p>
    <div class="mt-5"><WalletForm @saved="router.replace('/')" /></div>
    <button class="mt-4 w-full text-center text-xs text-muted hover:text-fg" @click="signOut()">{{ t('settings.logout') }}</button>
  </div>
</template>
