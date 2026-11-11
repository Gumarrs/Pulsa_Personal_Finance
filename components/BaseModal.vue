<script setup lang="ts">
import { X } from 'lucide-vue-next'
const open = defineModel<boolean>({ required: true })
defineProps<{ title: string }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
watch(open, (v) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('overflow-hidden', v)
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.documentElement.classList.remove('overflow-hidden')
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="open = false" />
        <div class="modal-panel relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-xl sm:max-w-md sm:rounded-2xl">
          <div class="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 class="font-semibold">{{ title }}</h2>
            <button class="btn-ghost h-8 w-8 p-0" aria-label="Close" @click="open = false"><X class="h-4 w-4" /></button>
          </div>
          <div class="overflow-y-auto px-5 py-4"><slot /></div>
          <div v-if="$slots.footer" class="border-t border-line px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
