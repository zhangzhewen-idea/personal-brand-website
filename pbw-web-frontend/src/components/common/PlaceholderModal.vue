<script setup lang="ts">import { X } from 'lucide-vue-next'; defineProps<{ open: boolean; title: string }>(); defineEmits<{ close: [] }>()</script>
<template>
  <Teleport to="body"><div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="$emit('close')"><div class="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><button class="absolute right-4 top-4 text-gray-500" aria-label="关闭" @click="$emit('close')"><X class="h-5 w-5" /></button><h3 class="mb-4 text-xl font-semibold">{{ title }}</h3><slot /></div></div></Teleport>
</template>
