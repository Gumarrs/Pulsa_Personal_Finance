<script setup lang="ts">
defineProps<{ title: string; text?: string; icon?: any }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-12 text-center">
    <span v-if="icon" class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-soft text-muted"><component :is="icon" class="h-6 w-6" /></span>
    <h3 class="font-medium">{{ title }}</h3>
    <p v-if="text" class="mt-1 max-w-xs text-sm text-muted">{{ text }}</p>
    <div class="mt-4 flex gap-2"><slot /></div>
  </div>
</template>
