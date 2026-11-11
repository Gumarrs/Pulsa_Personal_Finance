<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'auth' })
const { t } = useT()
const { signUp } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const needsConfirm = ref(false)
const showPassword = ref(false)

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = t('auth.passwordMin', 'Password must be at least 6 characters')
    return
  }
  loading.value = true
  try {
    const hasSession = await signUp(email.value.trim(), password.value, name.value.trim())
    if (hasSession) await router.replace('/')
    else needsConfirm.value = true
  } catch (e: any) {
    error.value = e?.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card p-8 w-full max-w-md mx-auto">
    <template v-if="needsConfirm">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-fg">{{ t('auth.checkEmailTitle', 'Check your email') }}</h1>
        <p class="mt-2 text-sm text-muted">{{ t('auth.checkEmail', { email }) }}</p>
        <NuxtLink to="/login" class="btn-secondary mt-6 w-full">{{ t('auth.backToLogin', 'Back to Login') }}</NuxtLink>
      </div>
    </template>

    <template v-else>
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-fg">{{ t('auth.registerTitle', 'Create Account') }}</h1>
        <p class="mt-2 text-sm text-muted">{{ t('auth.registerSub', 'Sign up to get started.') }}</p>
      </div>

      <form class="space-y-5" @submit.prevent="submit">
        <div>
          <label class="label">{{ t('auth.fullName', 'Full Name') }}</label>
          <input v-model="name" class="input" placeholder="John Doe" autocomplete="name" required />
        </div>
        
        <div>
          <label class="label">{{ t('auth.email', 'Email Address') }}</label>
          <input v-model="email" type="email" class="input" placeholder="your@email.com" autocomplete="email" required />
        </div>

        <div>
          <label class="label">{{ t('auth.password', 'Password') }}</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="input pr-10" 
              placeholder="••••••••"
              autocomplete="new-password" 
              required 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg focus:outline-none"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="err">{{ error }}</p>

        <button class="btn-primary w-full mt-2" :disabled="loading">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? t('common.loading', 'Loading...') : t('auth.signUp', 'Sign Up') }}
        </button>
      </form>

      <div class="mt-6 flex items-center justify-center space-x-2 text-sm">
        <span class="text-muted">{{ t('auth.hasAccount', 'Already have an account?') }}</span>
        <NuxtLink to="/login" class="font-semibold text-accent hover:underline">
          {{ t('auth.signIn', 'Log in here') }}
        </NuxtLink>
      </div>
    </template>
  </div>
</template>