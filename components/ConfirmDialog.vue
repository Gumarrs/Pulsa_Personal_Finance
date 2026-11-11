<script setup lang="ts">
const open = defineModel<boolean>({ required: true })
defineProps<{ title: string; text: string; confirmLabel: string; loading?: boolean; danger?: boolean }>()
defineEmits<{ (e: 'confirm'): void }>()
const { t } = useT()
</script>

<template>
  <BaseModal v-model="open" :title="title">
    <p class="text-sm text-muted">{{ text }}</p>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button class="btn-secondary" @click="open = false">{{ t('common.cancel') }}</button>
        <button :class="danger === false ? 'btn-primary' : 'btn-danger'" :disabled="loading" @click="$emit('confirm')">{{ confirmLabel }}</button>
      </div>
    </template>
  </BaseModal>
</template>
