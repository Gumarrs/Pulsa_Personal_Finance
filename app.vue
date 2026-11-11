<script setup lang="ts">
const { configured } = useSupabase()
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#10b981" :height="2" />
    <ConfigError v-if="!configured" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
    <ToastHost />
  </div>
</template>
