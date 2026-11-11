<script setup lang="ts">
import type { Wallet } from '~/types'
const open = defineModel<boolean>({ required: true })
defineProps<{ wallet?: Wallet | null }>()
const { t } = useT()
</script>

<template>
  <BaseModal v-model="open" :title="wallet ? t('wallet.edit') : t('wallet.add')">
    <WalletForm :wallet="wallet" show-cancel @saved="open = false" @cancel="open = false" />
  </BaseModal>
</template>
