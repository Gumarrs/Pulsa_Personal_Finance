<script setup lang="ts">
import { LogOut, Moon, Sun } from 'lucide-vue-next'
import type { Lang, Theme } from '~/composables/usePrefs'

const { t } = useT()
const { client } = useSupabase()
const { user, signOut } = useAuth()
const { profile } = useData()
const { lang, theme, currency, setLang, setTheme, setCurrency } = usePrefs()
const toast = useToast()

const name = ref(profile.value?.full_name ?? '')
watch(profile, (p) => { name.value = p?.full_name ?? '' })
const saving = ref(false)
const currencies = ['IDR', 'USD', 'EUR', 'SGD', 'MYR', 'GBP', 'AUD', 'JPY']
const themes: { v: Theme; icon: any }[] = [{ v: 'light', icon: Sun }, { v: 'dark', icon: Moon }]
const langs: { v: Lang; label: string }[] = [{ v: 'id', label: 'Bahasa Indonesia' }, { v: 'en', label: 'English' }]

async function saveName() {
  if (!user.value) return
  saving.value = true
  try {
    const full_name = name.value.trim()
    const { error } = await client.from('profiles').update({ full_name }).eq('id', user.value.id)
    if (error) throw error
    if (profile.value) profile.value = { ...profile.value, full_name }
    toast.success(t('settings.saved'))
  } catch (e: any) {
    toast.error(e?.message || t('common.error'))
  } finally {
    saving.value = false
  }
}

async function onCurrency(e: Event) {
  const c = (e.target as HTMLSelectElement).value
  setCurrency(c)
  // Sinkronisasi ke profil (best-effort); preferensi lokal tetap berlaku bila gagal
  if (user.value) await client.from('profiles').update({ currency: c }).eq('id', user.value.id)
}
</script>

<template>
  <div class="mx-auto max-w-xl">
    <h1 class="mb-5 text-xl font-semibold tracking-tight">{{ t('settings.title') }}</h1>

    <section class="card mb-4 p-4">
      <h2 class="mb-3 text-sm font-medium">{{ t('settings.profile') }}</h2>
      <div class="space-y-3">
        <div>
          <label class="label">{{ t('auth.email') }}</label>
          <input class="input" :value="user?.email" disabled />
        </div>
        <div>
          <label class="label">{{ t('settings.name') }}</label>
          <input v-model="name" class="input" maxlength="80" />
        </div>
        <div class="flex justify-end">
          <button class="btn-primary" :disabled="saving" @click="saveName">{{ saving ? t('common.saving') : t('common.save') }}</button>
        </div>
      </div>
    </section>

    <section class="card mb-4 space-y-4 p-4">
      <div>
        <h2 class="mb-2 text-sm font-medium">{{ t('settings.theme') }}</h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="x in themes"
            :key="x.v"
            class="flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm transition"
            :class="theme === x.v ? 'border-accent bg-accent/10 font-medium' : 'border-line text-muted hover:bg-soft'"
            @click="setTheme(x.v)"
          >
            <component :is="x.icon" class="h-4 w-4" />{{ t('settings.' + x.v) }}
          </button>
        </div>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-medium">{{ t('settings.language') }}</h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="x in langs"
            :key="x.v"
            class="rounded-xl border py-2.5 text-sm transition"
            :class="lang === x.v ? 'border-accent bg-accent/10 font-medium' : 'border-line text-muted hover:bg-soft'"
            @click="setLang(x.v)"
          >
            {{ x.label }}
          </button>
        </div>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-medium">{{ t('settings.currency') }}</h2>
        <select class="input" :value="currency" @change="onCurrency">
          <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
        </select>
        <p class="mt-1.5 text-xs text-muted">{{ t('settings.currencyNote') }}</p>
      </div>
    </section>

    <button class="btn-secondary w-full text-expense" @click="signOut()"><LogOut class="h-4 w-4" />{{ t('settings.logout') }}</button>
  </div>
</template>
