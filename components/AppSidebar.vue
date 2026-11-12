<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
const { t } = useT()
const route = useRoute()
const { user } = useAuth()
const { ask: askLogout } = useLogoutConfirm()
const active = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

const displayName = computed(() => {
  const meta = user.value?.user_metadata as Record<string, any> | undefined
  return String(meta?.full_name || meta?.name || user.value?.email?.split('@')[0] || '')
})
const initial = computed(() => (displayName.value.trim()[0] || '•').toUpperCase())
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-line bg-surface/80 backdrop-blur-xl md:flex lg:w-56">
    <div class="flex h-16 items-center justify-center lg:justify-start lg:px-5">
      <NuxtLink to="/" aria-label="Rinciin">
        <BrandMark size="sm" class="lg:hidden" compact />
        <BrandMark size="sm" class="hidden lg:inline-flex" />
      </NuxtLink>
    </div>

    <nav class="mt-2 flex-1 space-y-1 px-2.5 lg:px-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :title="t(item.key)"
        class="group relative flex h-11 items-center justify-center gap-3 rounded-xl text-sm font-medium transition lg:justify-start lg:px-2"
        :class="active(item.to) ? 'bg-accent/10 font-semibold text-accent' : 'text-muted hover:bg-soft hover:text-fg'"
        :aria-current="active(item.to) ? 'page' : undefined"
      >
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition"
          :class="active(item.to) ? 'bg-brand' : 'bg-transparent group-hover:bg-surface'"
        >
          <component :is="item.icon" class="h-[17px] w-[17px]" />
        </span>
        <span class="hidden truncate lg:inline">{{ t(item.key) }}</span>
      </NuxtLink>
    </nav>

    <div class="p-2.5 lg:p-3">
      <div class="hidden items-center gap-2.5 rounded-2xl border border-line bg-bg/60 p-2.5 lg:flex">
        <span class="bg-brand-tile grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold">{{ initial }}</span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[13px] font-semibold leading-tight">{{ displayName }}</p>
          <p class="truncate text-[11px] text-muted">{{ user?.email }}</p>
        </div>
        <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-soft hover:text-expense" :title="t('settings.logout')" :aria-label="t('settings.logout')" @click="askLogout()">
          <LogOut class="h-4 w-4" />
        </button>
      </div>
      <button
        class="flex h-11 w-full items-center justify-center rounded-xl text-muted transition hover:bg-soft hover:text-expense lg:hidden"
        :title="t('settings.logout')"
        :aria-label="t('settings.logout')"
        @click="askLogout()"
      >
        <LogOut class="h-[18px] w-[18px]" />
      </button>
    </div>
  </aside>
</template>
