<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useT()
const { sendReset } = useAuth()
const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await sendReset(email.value.trim())
    sent.value = true
  } catch (e: any) {
    error.value = e?.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card p-8 w-full max-w-md mx-auto">
    
    <!-- State Sukses -->
    <template v-if="sent">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-fg">{{ t('auth.linkSent', 'Check your email') }}</h1>
        <p class="mt-2 text-sm text-muted">Kami telah mengirimkan tautan reset kata sandi ke <strong>{{ email }}</strong>.</p>
        <NuxtLink to="/login" class="btn-secondary mt-6 w-full">{{ t('auth.backToLogin', 'Back to Login') }}</NuxtLink>
      </div>
    </template>

    <!-- State Form -->
    <template v-else>
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-fg">{{ t('auth.forgotTitle', 'Forgot Password?') }}</h1>
        <p class="mt-2 text-sm text-muted">{{ t('auth.forgotSub', 'No worries, we\'ll send you reset instructions.') }}</p>
      </div>

      <form class="space-y-5" @submit.prevent="submit">
        <div>
          <label class="label">{{ t('auth.email', 'Email Address') }}</label>
          <input 
            v-model="email" 
            type="email" 
            class="input" 
            placeholder="your@email.com"
            autocomplete="email" 
            required 
          />
        </div>
        
        <p v-if="error" class="err">{{ error }}</p>
        
        <button class="btn-primary w-full mt-2" :disabled="loading">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? t('common.loading', 'Sending...') : t('auth.sendLink', 'Reset Password') }}
        </button>
      </form>

      <div class="mt-6 flex items-center justify-center text-sm">
        <NuxtLink to="/login" class="font-medium text-muted hover:text-accent flex items-center gap-1 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {{ t('auth.backToLogin', 'Back to log in') }}
        </NuxtLink>
      </div>
    </template>

  </div>
</template>