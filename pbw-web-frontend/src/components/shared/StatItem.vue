<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  dark?: boolean
}>()
</script>

<template>
  <div class="text-center">
    <strong class="text-3xl font-bold md:text-4xl">{{ value }}</strong>
    <span class="mt-1 block text-sm" :class="dark ? 'text-gray-400' : 'text-gray-600'">{{ label }}</span>
  </div>
</template>
