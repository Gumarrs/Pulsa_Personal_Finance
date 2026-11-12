<script setup lang="ts">
const { configured } = useSupabase()
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#159b60" :height="2" />
    <ConfigError v-if="!configured" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
    <ToastHost />
  </div>
</template>
