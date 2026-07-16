<script setup lang="ts">
import { GraduationCap, Palette, TrendingUp, Video } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import type { CourseCardViewModel } from '@/models'
import { formatPrice } from '@/shared/formatters'

defineProps<{ course: CourseCardViewModel }>()
const emit = defineEmits<{ enroll: [course: CourseCardViewModel] }>()

const icons = { video: Video, graduation: GraduationCap, palette: Palette, trending: TrendingUp }
const colorMap = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  black: 'bg-black',
  red: 'bg-red-500',
}
</script>

<template>
  <article data-testid="course-card" class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div class="flex items-start justify-between p-6 text-white" :class="colorMap[course.color]">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
        <component :is="icons[course.icon]" :size="24" aria-hidden="true" />
      </div>
      <span
        v-if="course.isOnline"
        data-testid="course-status-online"
        class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
      >正在招生</span>
      <span
        v-else
        data-testid="course-status-offline"
        class="rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white"
      >即将上线</span>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <p v-if="course.courseTag" class="text-sm font-medium text-gray-500">{{ course.courseTag }}</p>
      <h3 class="mt-2 text-xl font-semibold text-gray-950">{{ course.courseName }}</h3>
      <p class="mt-3 min-h-14 text-sm leading-6 text-gray-600">{{ course.courseIntro }}</p>

      <div class="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
        <span>{{ course.duration }}</span>
        <span>{{ course.lessons }} 课时</span>
      </div>

      <ul class="mt-5 flex-1 space-y-2 text-sm text-gray-600">
        <li v-for="feature in course.features" :key="feature" class="flex gap-2">
          <span class="text-gray-950" aria-hidden="true">✓</span>
          <span>{{ feature }}</span>
        </li>
      </ul>

      <div class="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
        <strong class="text-xl text-gray-950">{{ formatPrice(course.coursePrice) }}</strong>
        <BaseButton
          variant="primary"
          size="sm"
          :disabled="!course.isOnline"
          @click="emit('enroll', course)"
        >{{ course.isOnline ? '立即报名' : '敬请期待' }}</BaseButton>
      </div>
    </div>
  </article>
</template>
