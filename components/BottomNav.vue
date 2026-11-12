<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
const { t } = useT()
const route = useRoute()
const { open } = useTxModal()
const by = (to: string) => navItems.find(i => i.to === to)!
const left = [by('/'), by('/transactions')]
const right = [by('/wallets'), by('/analytics')]
const active = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
    <div class="mx-auto grid h-[68px] max-w-md grid-cols-5 items-center">
      <NuxtLink v-for="item in left" :key="item.to" :to="item.to" class="relative flex flex-col items-center gap-1 text-[10px] font-semibold transition" :class="active(item.to) ? 'text-accent' : 'text-muted'">
        <span v-if="active(item.to)" class="bg-brand absolute -top-[13px] h-[3px] w-8 rounded-b-full" />
        <component :is="item.icon" class="h-5 w-5" />{{ t(item.key) }}
      </NuxtLink>
      <button class="bg-brand mx-auto -mt-7 grid h-14 w-14 place-items-center rounded-full ring-4 ring-bg transition active:scale-95" :aria-label="t('tx.add')" @click="open()">
        <Plus class="h-6 w-6" :stroke-width="2.25" />
      </button>
      <NuxtLink v-for="item in right" :key="item.to" :to="item.to" class="relative flex flex-col items-center gap-1 text-[10px] font-semibold transition" :class="active(item.to) ? 'text-accent' : 'text-muted'">
        <span v-if="active(item.to)" class="bg-brand absolute -top-[13px] h-[3px] w-8 rounded-b-full" />
        <component :is="item.icon" class="h-5 w-5" />{{ t(item.key) }}
      </NuxtLink>
    </div>
  </nav>
</template>
