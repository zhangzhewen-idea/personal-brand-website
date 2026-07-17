<script setup lang="ts">
import PlaceholderModal from './PlaceholderModal.vue'
import { resolveMediaUrl } from '@/utils/media-url'

defineProps<{ open: boolean; title: string; videoUrl: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <PlaceholderModal :open="open" :title="title" @close="$emit('close')">
    <video
      v-if="open && videoUrl"
      :src="resolveMediaUrl(videoUrl)"
      controls
      autoplay
      playsinline
      class="aspect-video w-full rounded-lg bg-black"
    />
  </PlaceholderModal>
</template>
