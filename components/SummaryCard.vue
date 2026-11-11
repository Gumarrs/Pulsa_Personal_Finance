<script setup lang="ts">
const props = defineProps<{ label: string; value: string; tone?: 'default' | 'income' | 'expense' | 'transfer'; icon?: any; hint?: string }>()
const toneClass = computed(() => ({ income: 'text-income', expense: 'text-expense', transfer: 'text-transfer', default: '' }[props.tone ?? 'default']))
</script>

<template>
  <div class="card min-w-0 p-4">
    <div class="flex items-center justify-between gap-2">
      <span class="truncate text-xs font-medium text-muted">{{ label }}</span>
      <component :is="icon" v-if="icon" class="h-4 w-4 shrink-0" :class="toneClass || 'text-muted'" />
    </div>
    <p class="num mt-2 truncate text-lg font-semibold tracking-tight sm:text-2xl" :class="toneClass">{{ value }}</p>
    <p v-if="hint" class="mt-1 truncate text-xs text-muted">{{ hint }}</p>
  </div>
</template>
