import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCourses } from '@/services/course.service'
import type { CourseCardViewModel } from '@/models'
import type { LoadStatus } from './site.store'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<CourseCardViewModel[]>([])
  const status = ref<LoadStatus>('idle')
  const errorMessage = ref<string | null>(null)
  let loadingPromise: Promise<void> | null = null

  async function load(): Promise<void> {
    if (status.value === 'success') {
      return
    }

    if (status.value === 'loading' && loadingPromise) {
      return loadingPromise
    }

    status.value = 'loading'
    errorMessage.value = null
    loadingPromise = getCourses()
      .then((loadedCourses) => {
        courses.value = loadedCourses
        status.value = 'success'
      })
      .catch((error: unknown) => {
        status.value = 'error'
        errorMessage.value = error instanceof Error ? error.message : '课程加载失败'
      })
      .finally(() => {
        loadingPromise = null
      })

    return loadingPromise
  }

  return {
    courses,
    status,
    errorMessage,
    load,
  }
})
