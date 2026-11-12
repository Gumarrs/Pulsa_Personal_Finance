<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md'; compact?: boolean }>(), { size: 'md' })
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <span class="bg-brand-tile grid shrink-0 place-items-center text-white shadow-[0_5px_14px_#16744735]" :class="size === 'sm' ? 'h-8 w-8 rounded-[11px]' : 'h-10 w-10 rounded-[13px]'">
      <svg :class="size === 'sm' ? 'h-[18px] w-[18px]' : 'h-[22px] w-[22px]'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7h16M4 12h10M4 17h7" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </span>
    <span v-if="!compact" class="font-extrabold tracking-[-0.04em]" :class="size === 'sm' ? 'text-lg' : 'text-2xl'">Rinciin<span class="text-accent">.</span></span>
  </span>
</template>
