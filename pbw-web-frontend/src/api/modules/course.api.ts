import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { Course } from '@/models'

export async function getCourses(): Promise<Course[]> {
  const { data } = await http.get<Course[]>(endpoints.courses)
  return data
}
