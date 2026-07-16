import { coursePresentation } from '@/configs/course.config'
import { courseMocks } from '@/mocks/content.mock'
import type { CourseCardViewModel } from '@/models'

export async function getCourses(): Promise<CourseCardViewModel[]> {
  const courses = courseMocks
    .filter((course) => !course.isDeleted)
    .map((course) => {
      const presentation = coursePresentation[course.id]

      if (!presentation) {
        throw new Error(`课程 ${course.id} 缺少展示配置`)
      }

      return { ...course, ...presentation }
    })

  return structuredClone(courses)
}
