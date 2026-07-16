<template>
  <div class="media-thumbnail" :class="{ 'is-round': round }">
    <img v-if="src && !hasError" :src="src" :alt="alt" @error="hasError = true" />
    <span v-else class="media-thumbnail__fallback" :aria-label="alt">{{ alt.slice(0, 1) || '?' }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ src?: string; alt?: string; round?: boolean }>(), { alt: '', round: false })
const hasError = ref(false)
watch(() => props.src, () => { hasError.value = false })
</script>

<style scoped>
.media-thumbnail { display: grid; width: 48px; height: 48px; overflow: hidden; place-items: center; border-radius: 8px; background: #e9edff; color: var(--pbw-primary); font-weight: 600; }
.media-thumbnail.is-round { border-radius: 50%; }
.media-thumbnail img { display: block; width: 100%; height: 100%; object-fit: cover; }
.media-thumbnail__fallback { font-size: 18px; }
</style>
