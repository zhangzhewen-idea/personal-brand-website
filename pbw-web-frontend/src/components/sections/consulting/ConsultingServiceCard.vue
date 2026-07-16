<script setup lang="ts">
import type { Component } from 'vue'
import { Award, Camera, Sparkles, Video } from 'lucide-vue-next'
import type { ConsultingService } from '@/configs/consulting.config'
import type { CardColor } from '@/models'

const props = defineProps<{
  service: ConsultingService
}>()

const iconMap: Record<ConsultingService['icon'], Component> = {
  video: Video,
  sparkles: Sparkles,
  camera: Camera,
  award: Award,
}

const colorClasses: Record<CardColor, { icon: string; accent: string }> = {
  blue: { icon: 'bg-blue-100 text-blue-600', accent: 'bg-blue-500' },
  purple: { icon: 'bg-purple-100 text-purple-600', accent: 'bg-purple-500' },
  pink: { icon: 'bg-pink-100 text-pink-600', accent: 'bg-pink-500' },
  green: { icon: 'bg-green-100 text-green-600', accent: 'bg-green-500' },
  orange: { icon: 'bg-orange-100 text-orange-600', accent: 'bg-orange-500' },
  black: { icon: 'bg-gray-200 text-gray-900', accent: 'bg-gray-950' },
  red: { icon: 'bg-red-100 text-red-600', accent: 'bg-red-500' },
}
</script>

<template>
  <article data-testid="consulting-service-card" class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
    <div :class="['absolute inset-x-0 top-0 h-1', colorClasses[props.service.color].accent]" />
    <div :class="['flex h-12 w-12 items-center justify-center rounded-xl', colorClasses[props.service.color].icon]">
      <component :is="iconMap[props.service.icon]" :size="24" :stroke-width="1.8" aria-hidden="true" />
    </div>
    <h2 class="mt-5 text-xl font-semibold text-gray-950">{{ props.service.title }}</h2>
    <p class="mt-3 min-h-14 text-sm leading-6 text-gray-600">{{ props.service.description }}</p>
    <ul class="mt-5 space-y-3 text-sm text-gray-600">
      <li v-for="feature in props.service.features" :key="feature" class="flex items-center gap-2">
        <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', colorClasses[props.service.color].accent]" />
        <span>{{ feature }}</span>
      </li>
    </ul>
    <div class="mt-auto flex items-end justify-between gap-4 border-t border-gray-100 pt-5">
      <div>
        <p class="text-xs text-gray-500">服务报价</p>
        <p class="mt-1 text-lg font-semibold text-gray-950">{{ props.service.price }}</p>
      </div>
      <p class="text-right text-xs text-gray-500">{{ props.service.duration }}</p>
    </div>
  </article>
</template>
