<script setup lang="ts">
import { Moon, Plus, Settings, Sun } from 'lucide-vue-next'
const { t } = useT()
const { theme, setTheme } = usePrefs()
const { open } = useTxModal()
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line/70 bg-bg/75 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl md:justify-end md:px-6">
    <NuxtLink to="/" class="md:hidden" aria-label="Rinciin"><BrandMark size="sm" /></NuxtLink>
    <div class="flex items-center gap-2">
      <button class="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:border-accent/40 hover:text-accent" :aria-label="t('settings.theme')" @click="setTheme(theme === 'dark' ? 'light' : 'dark')">
        <component :is="theme === 'dark' ? Sun : Moon" class="h-[18px] w-[18px]" />
      </button>
      <NuxtLink to="/settings" class="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:border-accent/40 hover:text-accent md:hidden" :aria-label="t('nav.settings')">
        <Settings class="h-[18px] w-[18px]" />
      </NuxtLink>
      <button class="btn-primary hidden md:inline-flex" @click="open()"><Plus class="h-4 w-4" />{{ t('tx.add') }}</button>
    </div>
  </header>
</template>
