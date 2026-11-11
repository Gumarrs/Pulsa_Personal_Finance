<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'auth' })
const { t } = useT()
const { signIn } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await signIn(email.value.trim(), password.value)
    await router.replace('/')
  } catch (e: any) {
    error.value = e?.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Card Container dengan shadow lebih halus dan rounded lebih besar -->
  <div class="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
    
    <!-- Header Logo & Title -->
    <div class="mb-10 text-center flex flex-col items-center">
      <img src="/public/rinciin.svg" alt="Logo Rinciin" class="h-16 w-auto" />
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ t('auth.loginTitle', 'Masuk ke Rinciin') }}</h1>
      <p class="mt-2 text-sm text-gray-500">{{ t('auth.loginSub', 'Pelacak Keuangan Pribadi.') }}</p>
    </div>

    <form class="space-y-5" @submit.prevent="submit">
      <!-- Input Email -->
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700">{{ t('auth.email', 'Email') }}</label>
        <input 
          v-model="email" 
          type="email" 
          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400" 
          placeholder="your@email.com"
          autocomplete="email" 
          required 
        />
      </div>

      <!-- Input Password -->
      <div class="space-y-1.5">
        <!-- Label & Link Lupa Sandi sejajar -->
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">{{ t('auth.password', 'Kata sandi') }}</label>
          <NuxtLink to="/forgot-password" class="text-sm font-medium text-emerald-600 hover:text-emerald-500 hover:underline transition-colors">
            {{ t('auth.forgot', 'Lupa kata sandi?') }}
          </NuxtLink>
        </div>
        
        <div class="relative">
          <input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400 pr-12" 
            placeholder="••••••••"
            autocomplete="current-password" 
            required 
          />
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <!-- Icon Eye/Eye-slash -->
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
          </button>
        </div>
      </div>

      <!-- Pesan Error (Ditampilkan lebih rapi jika ada error) -->
      <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ error }}</span>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit"
        class="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-[#0a8764] hover:bg-[#086c50] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed" 
        :disabled="loading"
      >
        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? t('common.loading', 'Memuat...') : t('auth.signIn', 'Masuk') }}
      </button>
    </form>

    <!-- Footer Register -->
    <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-sm">
      <span class="text-gray-500">{{ t('auth.noAccount', 'Belum punya akun?') }}</span>
      <NuxtLink to="/register" class="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline transition-colors">
        {{ t('auth.signUp', 'Daftar') }}
      </NuxtLink>
    </div>
  </div>
</template>