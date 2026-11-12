<script setup lang="ts">
import type { DateRange, Preset } from '~/types'
const preset = defineModel<Preset>('preset', { required: true })
const custom = defineModel<DateRange>('custom', { required: true })
const { t } = useT()
const presets: Preset[] = ['today', 'week', 'month', 'year', 'custom']

function onDate(key: 'from' | 'to', e: Event) {
  const v = (e.target as HTMLInputElement).value
  if (v) custom.value = { ...custom.value, [key]: v }
}
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
    <div class="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1 shadow-sm" role="tablist">
      <button
        v-for="p in presets"
        :key="p"
        role="tab"
        :aria-selected="preset === p"
        class="shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition"
        :class="preset === p ? 'bg-brand shadow-sm' : 'text-muted hover:bg-soft hover:text-fg'"
        @click="preset = p"
      >
        {{ t('period.' + p) }}
      </button>
    </div>
    <div v-if="preset === 'custom'" class="flex items-center gap-2">
      <input type="date" class="input h-9 min-w-0 flex-1 text-xs sm:w-36 sm:flex-none" :value="custom.from" @change="onDate('from', $event)" />
      <span class="text-muted">–</span>
      <input type="date" class="input h-9 min-w-0 flex-1 text-xs sm:w-36 sm:flex-none" :value="custom.to" @change="onDate('to', $event)" />
    </div>
  </div>
</template>
