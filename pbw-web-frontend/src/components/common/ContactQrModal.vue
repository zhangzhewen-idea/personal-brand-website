<script setup lang="ts">
import PlaceholderModal from './PlaceholderModal.vue'
import { resolveMediaUrl } from '@/utils/media-url'

defineProps<{ open: boolean; title: string; description: string; qrCodeUrl: string | null }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <PlaceholderModal :open="open" :title="title" @close="$emit('close')">
    <div class="space-y-4 text-center">
      <p class="text-gray-600">{{ description }}</p>
      <img
        v-if="qrCodeUrl"
        :src="resolveMediaUrl(qrCodeUrl)"
        alt="联系二维码"
        class="mx-auto h-64 w-64 rounded-xl bg-white object-contain p-3 shadow"
      />
      <p v-else class="rounded-lg bg-gray-50 p-6 text-gray-500">暂未配置联系二维码</p>
    </div>
  </PlaceholderModal>
</template>
