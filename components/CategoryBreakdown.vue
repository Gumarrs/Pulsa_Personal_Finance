<script setup lang="ts">
import type { CatTotal } from '~/utils/report'
defineProps<{ items: CatTotal[] }>()
defineEmits<{ (e: 'select', item: CatTotal): void }>()
const { money } = useMoney()
</script>

<template>
  <ul class="space-y-3.5">
    <li v-for="c in items" :key="c.id || 'none'">
      <button class="group w-full rounded-lg text-left" @click="$emit('select', c)">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="flex min-w-0 items-center gap-2.5">
            <span class="h-2.5 w-2.5 shrink-0 rounded-[4px]" :style="{ backgroundColor: c.color }" />
            <span class="truncate font-medium transition group-hover:text-accent">{{ c.name }}</span>
          </span>
          <span class="num shrink-0 text-xs text-muted"><b class="font-semibold text-fg">{{ money(c.total) }}</b> · {{ Math.round(c.share * 100) }}%</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-soft">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: Math.max(2, c.share * 100) + '%', backgroundImage: `linear-gradient(90deg, ${c.color}, color-mix(in srgb, ${c.color} 62%, white))` }"
          />
        </div>
      </button>
    </li>
  </ul>
</template>
