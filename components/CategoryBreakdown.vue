<script setup lang="ts">
import type { CatTotal } from '~/utils/report'
defineProps<{ items: CatTotal[] }>()
defineEmits<{ (e: 'select', item: CatTotal): void }>()
const { money } = useMoney()
</script>

<template>
  <ul class="space-y-3">
    <li v-for="c in items" :key="c.id || 'none'">
      <button class="w-full text-left" @click="$emit('select', c)">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="flex min-w-0 items-center gap-2">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: c.color }" />
            <span class="truncate">{{ c.name }}</span>
          </span>
          <span class="num shrink-0 text-xs text-muted">{{ money(c.total) }} · {{ Math.round(c.share * 100) }}%</span>
        </div>
        <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-soft">
          <div class="h-full rounded-full transition-all" :style="{ width: Math.max(2, c.share * 100) + '%', backgroundColor: c.color }" />
        </div>
      </button>
    </li>
  </ul>
</template>
