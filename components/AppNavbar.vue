<script setup lang="ts">
import { Activity, Moon, Plus, Settings, Sun } from 'lucide-vue-next'
const { t } = useT()
const { theme, setTheme } = usePrefs()
const { open } = useTxModal()
</script>

<template>
  <header class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-bg px-4 pt-[env(safe-area-inset-top)] md:justify-end md:px-6">
    <NuxtLink to="/" class="flex items-center gap-2 md:hidden">
      <span class="grid h-7 w-7 place-items-center rounded-lg bg-accent text-accent-fg"><Activity class="h-4 w-4" /></span>
      <span class="font-semibold tracking-tight">Rinciin</span>
    </NuxtLink>
    <div class="flex items-center gap-1.5">
      <button class="btn-ghost h-9 w-9 p-0" :aria-label="t('settings.theme')" @click="setTheme(theme === 'dark' ? 'light' : 'dark')">
        <component :is="theme === 'dark' ? Sun : Moon" class="h-4 w-4" />
      </button>
      <NuxtLink to="/settings" class="btn-ghost h-9 w-9 p-0 md:hidden" :aria-label="t('nav.settings')"><Settings class="h-4 w-4" /></NuxtLink>
      <button class="btn-primary ml-1 hidden md:inline-flex" @click="open()"><Plus class="h-4 w-4" />{{ t('tx.add') }}</button>
    </div>
  </header>
</template>
