<script setup lang="ts">
defineProps<{ title: string; text?: string; icon?: any }>()
</script>

<template>
  <div class="glow-corner flex flex-col items-center justify-center rounded-[22px] border border-dashed border-accent/30 bg-surface/60 px-6 py-14 text-center">
    <span v-if="icon" class="bg-brand-tile mb-5 grid h-14 w-14 place-items-center rounded-2xl shadow-[0_8px_20px_#16855230]"><component :is="icon" class="h-6 w-6" /></span>
    <h3 class="text-base font-bold tracking-tight">{{ title }}</h3>
    <p v-if="text" class="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">{{ text }}</p>
    <div class="mt-5 flex gap-2"><slot /></div>
  </div>
</template>
