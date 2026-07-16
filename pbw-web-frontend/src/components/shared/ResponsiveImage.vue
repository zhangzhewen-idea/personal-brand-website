<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string | null
    alt?: string
    fallbackText?: string
    class?: string
  }>(),
  { alt: '', fallbackText: '图片加载失败' },
)

const hasError = ref(!props.src)
const imageClass = computed(() => props.class)

watch(
  () => props.src,
  (src) => {
    hasError.value = !src
  },
)
</script>

<template>
  <div class="relative overflow-hidden">
    <img v-if="!hasError && src" :class="imageClass" :src="src" :alt="alt" @error="hasError = true">
    <div v-else data-testid="image-fallback" :class="['flex items-center justify-center bg-gray-200 text-center text-xs text-gray-500', imageClass]" role="img" :aria-label="`${alt}加载失败`">{{ fallbackText }}</div>
  </div>
</template>
