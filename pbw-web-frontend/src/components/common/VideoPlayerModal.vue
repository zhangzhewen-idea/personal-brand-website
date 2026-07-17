<script setup lang="ts">
import PlaceholderModal from './PlaceholderModal.vue'

defineProps<{ open: boolean; title: string; videoUrl: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <PlaceholderModal :open="open" :title="title" @close="$emit('close')">
    <video
      v-if="open && videoUrl"
      :src="videoUrl"
      controls
      autoplay
      playsinline
      class="aspect-video w-full rounded-lg bg-black"
    />
  </PlaceholderModal>
</template>
