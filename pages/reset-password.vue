<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'auth' })
const { t } = useT()
const { user, updatePassword } = useAuth()
const toast = useToast()
const router = useRouter()

const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = t('auth.passwordMin', 'Password must be at least 6 characters')
    return
  }
  loading.value = true
  try {
    await updatePassword(password.value)
    toast.success(t('auth.passwordUpdated'))
    await router.replace('/')
  } catch (e: any) {
    error.value = e?.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card p-8 w-full max-w-md mx-auto">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-fg">{{ t('auth.resetTitle', 'Reset Password') }}</h1>
      <p v-if="user" class="mt-2 text-sm text-muted">{{ t('auth.resetSub', 'Enter your new password below.') }}</p>
    </div>

    <template v-if="user">
      <form class="space-y-5" @submit.prevent="submit">
        <div>
          <label class="label">{{ t('auth.newPassword', 'New Password') }}</label>
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
          {{ loading ? t('common.loading', 'Updating...') : t('auth.updatePassword', 'Update Password') }}
        </button>
      </form>
    </template>
    
    <template v-else>
      <div class="text-center">
        <p class="text-sm text-muted">{{ t('auth.invalidLink', 'Your reset link is invalid or has expired.') }}</p>
        <NuxtLink to="/forgot-password" class="btn-secondary mt-6 w-full">{{ t('auth.sendLink', 'Request new link') }}</NuxtLink>
      </div>
    </template>
  </div>
</template>