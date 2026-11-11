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
  <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
    <div class="mx-auto grid h-16 max-w-md grid-cols-5 items-center">
      <NuxtLink v-for="item in left" :key="item.to" :to="item.to" class="flex flex-col items-center gap-1 text-[10px] font-medium" :class="active(item.to) ? 'text-accent' : 'text-muted'">
        <component :is="item.icon" class="h-5 w-5" />{{ t(item.key) }}
      </NuxtLink>
      <button class="-mt-6 mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-fg shadow-lg transition active:scale-95" :aria-label="t('tx.add')" @click="open()">
        <Plus class="h-6 w-6" />
      </button>
      <NuxtLink v-for="item in right" :key="item.to" :to="item.to" class="flex flex-col items-center gap-1 text-[10px] font-medium" :class="active(item.to) ? 'text-accent' : 'text-muted'">
        <component :is="item.icon" class="h-5 w-5" />{{ t(item.key) }}
      </NuxtLink>
    </div>
  </nav>
</template>
