<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import CourseCard from '@/components/sections/services/CourseCard.vue'
import { useCourseStore } from '@/stores/course.store'
import type { CourseCardViewModel } from '@/models'

const courseStore = useCourseStore()
const selectedCourse = ref<CourseCardViewModel | null>(null)
const isDialogOpen = ref(false)

function openEnrollment(course: CourseCardViewModel) {
  selectedCourse.value = course
  isDialogOpen.value = true
}

onMounted(() => {
  void courseStore.load()
})
</script>

<template>
  <section data-testid="services-view" class="bg-gray-50 px-6 py-16 sm:py-24">
    <div class="mx-auto max-w-7xl">
      <header class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">服务课程</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">课程体系</h1>
        <p class="mt-5 text-lg leading-8 text-gray-600">系统化的剪辑课程，从入门到精通，助你成为优秀的视频创作者</p>
      </header>

      <div v-if="courseStore.status === 'idle' || courseStore.status === 'loading'" data-testid="services-loading" class="flex min-h-[30vh] items-center justify-center py-16 text-gray-500">课程加载中…</div>
      <div v-else-if="courseStore.status === 'error'" data-testid="services-error" class="flex min-h-[30vh] flex-col items-center justify-center gap-5 py-16 text-center" role="alert">
        <p class="text-lg text-red-600">{{ courseStore.errorMessage || '课程加载失败' }}</p>
        <BaseButton variant="outline" @click="courseStore.load">重新加载</BaseButton>
      </div>
      <div v-else data-testid="course-grid" class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <CourseCard v-for="course in courseStore.courses" :key="course.id" :course="course" @enroll="openEnrollment" />
      </div>
    </div>

    <BaseDialog v-if="selectedCourse" v-model="isDialogOpen" :title="`报名${selectedCourse.courseName}`">
      <div class="space-y-4">
        <p class="leading-7 text-gray-600">你选择了「{{ selectedCourse.courseName }}」。</p>
        <p class="text-sm text-gray-500">报名功能将在支付服务接入后开放，当前仅展示课程信息。</p>
      </div>
    </BaseDialog>
  </section>
</template>
