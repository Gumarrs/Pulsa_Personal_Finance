<script setup lang="ts">
import { Activity, LogOut } from 'lucide-vue-next'
const { t } = useT()
const route = useRoute()
const { signOut } = useAuth()
const active = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-line bg-surface md:flex lg:w-56">
    <div class="flex h-14 items-center justify-center gap-2.5 lg:justify-start lg:px-5">
      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg"><Activity class="h-4 w-4" /></span>
      <span class="hidden text-base font-semibold tracking-tight lg:inline">PULSA</span>
    </div>
    <nav class="mt-2 flex-1 space-y-1 px-2 lg:px-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :title="t(item.key)"
        class="flex h-10 items-center justify-center gap-3 rounded-lg text-sm font-medium transition lg:justify-start lg:px-3"
        :class="active(item.to) ? 'bg-soft text-fg' : 'text-muted hover:bg-soft hover:text-fg'"
      >
        <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" />
        <span class="hidden lg:inline">{{ t(item.key) }}</span>
      </NuxtLink>
    </nav>
    <div class="p-2 lg:p-3">
      <button
        class="flex h-10 w-full items-center justify-center gap-3 rounded-lg text-sm text-muted transition hover:bg-soft hover:text-fg lg:justify-start lg:px-3"
        :title="t('settings.logout')"
        @click="signOut()"
      >
        <LogOut class="h-[18px] w-[18px] shrink-0" />
        <span class="hidden lg:inline">{{ t('settings.logout') }}</span>
      </button>
    </div>
  </aside>
</template>
