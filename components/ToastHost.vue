<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info } from 'lucide-vue-next'
const { toasts, remove } = useToast()
const icons = { success: CheckCircle2, error: AlertCircle, info: Info }
const tones = { success: 'text-income', error: 'text-expense', info: 'text-transfer' }
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6">
    <TransitionGroup name="toast">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm shadow-lg"
        @click="remove(item.id)"
      >
        <component :is="icons[item.type]" class="mt-0.5 h-4 w-4 shrink-0" :class="tones[item.type]" />
        <span>{{ item.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
