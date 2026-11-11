<script setup lang="ts">
import { Activity } from 'lucide-vue-next'
const { lang, setLang } = usePrefs()
</script>

<template>
  <div class="relative grid min-h-screen place-items-center bg-bg px-4 py-10">
    <button class="btn-ghost absolute right-4 top-4 h-9 text-xs" @click="setLang(lang === 'id' ? 'en' : 'id')">
      {{ lang === 'id' ? 'English' : 'Indonesia' }}
    </button>
    <div class="w-full max-w-sm">
      <div class="mb-8 flex items-center justify-center gap-2.5">
      </div>
      <slot />
    </div>
  </div>
</template>
