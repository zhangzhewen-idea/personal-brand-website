<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <header class="mb-12 text-center">
    <h2 class="mb-4 text-4xl font-bold">{{ title }}</h2>
    <p class="text-gray-600">{{ description }}</p>
  </header>
</template>
