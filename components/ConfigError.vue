<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
const { t } = useT()
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-bg p-6">
    <div class="card max-w-md p-6 text-center">
      <AlertTriangle class="mx-auto mb-3 h-8 w-8 text-expense" />
      <h1 class="text-lg font-semibold">{{ t('config.title') }}</h1>
      <p class="mt-2 text-sm text-muted">{{ t('config.text') }}</p>
      <pre class="mt-4 overflow-x-auto rounded-lg bg-soft p-3 text-left text-xs">NUXT_PUBLIC_SUPABASE_URL=...
NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...</pre>
    </div>
  </div>
</template>
