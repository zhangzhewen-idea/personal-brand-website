import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { HomeContent } from '@/models'
import { getHomeContent } from '@/services/site.service'
import { getCourses } from '@/services/course.service'
import { useSiteStore } from '@/stores/site.store'
import { useCourseStore } from '@/stores/course.store'

vi.mock('@/services/site.service', () => ({
  getHomeContent: vi.fn(),
}))

vi.mock('@/services/course.service', () => ({
  getCourses: vi.fn(),
}))

const mockedGetHomeContent = vi.mocked(getHomeContent)
const mockedGetCourses = vi.mocked(getCourses)

const homeContent = {
  basicInfo: { id: 1, slogan: '保持创作' },
  videos: [],
  materials: [],
  matrixAccounts: [],
} as unknown as HomeContent

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('content stores', () => {
  it('loads site content through idle, loading, and success states', async () => {
    mockedGetHomeContent.mockResolvedValue(homeContent)
    const store = useSiteStore()

    expect(store.status).toBe('idle')

    const loading = store.load()
    expect(store.status).toBe('loading')

    await loading

    expect(store.status).toBe('success')
    expect(store.basicInfo).toEqual(homeContent.basicInfo)
    expect(store.errorMessage).toBeNull()
  })

  it('stores a readable error when site content loading fails', async () => {
    mockedGetHomeContent.mockRejectedValue(new Error('站点内容读取失败'))
    const store = useSiteStore()

    await store.load()

    expect(store.status).toBe('error')
    expect(store.errorMessage).toBe('站点内容读取失败')
  })

  it('keeps the course list returned by the service without filtering in the store', async () => {
    const courses = [{ id: 1, courseName: '课程服务结果' }]
    mockedGetCourses.mockResolvedValue(courses as never)
    const store = useCourseStore()

    await store.load()

    expect(mockedGetCourses).toHaveBeenCalledOnce()
    expect(store.courses).toEqual(courses)
    expect(store.status).toBe('success')
  })

  it('does not request again when load is called after success', async () => {
    mockedGetCourses.mockResolvedValue([])
    const store = useCourseStore()

    await store.load()
    await store.load()

    expect(mockedGetCourses).toHaveBeenCalledOnce()
  })
})
