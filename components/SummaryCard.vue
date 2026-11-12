<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  tone?: 'default' | 'income' | 'expense' | 'transfer'
  icon?: any
  hint?: string
  /** Kartu utama bergradien hijau (mis. total saldo). */
  hero?: boolean
}>()
const toneClass = computed(() => (props.hero ? 'is-hero' : `tone-${props.tone ?? 'default'}`))
</script>

<template>
  <div class="summary rise-in" :class="toneClass">
    <span class="orb orb-a" aria-hidden="true" />
    <span class="orb orb-b" aria-hidden="true" />
    <div class="relative flex items-center justify-between gap-2">
      <span class="label truncate">{{ label }}</span>
      <span v-if="icon" class="chip"><component :is="icon" class="h-[17px] w-[17px]" /></span>
    </div>
    <p class="value num relative truncate font-bold tracking-tight" :class="hero ? 'mt-3 text-2xl sm:text-[30px]' : 'mt-3 text-lg sm:text-2xl'" :title="value">{{ value }}</p>
    <p v-if="hint" class="hint relative mt-1 truncate text-xs">{{ hint }}</p>
  </div>
</template>

<style scoped>
.summary {
  --t: var(--c-accent);
  position: relative;
  min-width: 0;
  overflow: hidden;
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgb(var(--t) / 0.2);
  background:
    linear-gradient(150deg, rgb(var(--t) / 0.12), rgb(var(--t) / 0.02) 65%),
    rgb(var(--c-surface));
  box-shadow: var(--shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.summary:hover {
  transform: translateY(-2px);
}

.tone-income { --t: var(--c-income); }
.tone-expense { --t: var(--c-expense); }
.tone-transfer { --t: var(--c-transfer); }

.label {
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--c-muted));
}
.chip {
  display: grid;
  height: 34px;
  width: 34px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 11px;
  color: rgb(var(--t));
  background: rgb(var(--t) / 0.14);
}
.value {
  color: rgb(var(--c-fg));
}
.tone-income .value,
.tone-expense .value,
.tone-transfer .value {
  color: rgb(var(--t));
}
.hint {
  color: rgb(var(--c-muted));
}

.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.orb-a {
  top: -60px;
  right: -50px;
  height: 140px;
  width: 140px;
  background: radial-gradient(circle, rgb(var(--t) / 0.22), transparent 70%);
}
.orb-b {
  display: none;
}

/* Kartu hero — hijau pekat seperti tombol/brand di halaman login */
.is-hero {
  border-color: transparent;
  background: linear-gradient(135deg, #0f5233 0%, #147a4b 55%, #17a068 100%);
  box-shadow: 0 14px 34px rgb(22 134 83 / 0.3);
  color: #fff;
}
.is-hero .label,
.is-hero .hint {
  color: rgb(255 255 255 / 0.78);
}
.is-hero .value {
  color: #fff;
}
.is-hero .chip {
  color: #fff;
  background: rgb(255 255 255 / 0.18);
}
.is-hero .orb-a {
  top: -70px;
  right: -40px;
  height: 180px;
  width: 180px;
  background: radial-gradient(circle, rgb(255 255 255 / 0.22), transparent 68%);
}
.is-hero .orb-b {
  display: block;
  bottom: -90px;
  left: -50px;
  height: 170px;
  width: 170px;
  background: radial-gradient(circle, rgb(255 255 255 / 0.1), transparent 70%);
}

@media (prefers-reduced-motion: reduce) {
  .summary { transition: none; }
}
</style>
