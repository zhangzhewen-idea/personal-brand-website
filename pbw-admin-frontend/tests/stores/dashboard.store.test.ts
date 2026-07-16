import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { basicInfoMock } from '@/mocks/data/database.mock'
import type { DashboardSummary } from '@/models/dashboard'
import { dashboardService } from '@/services/dashboard.service'
import { useDashboardStore } from '@/stores/dashboard.store'

const createSummary = (userCount: number): DashboardSummary => ({
  userCount,
  videoCount: 0,
  materialCount: 0,
  materialTotalPrice: 0,
  matrixAccountCount: 0,
  courseCount: 0,
  onlineCourseCount: 0,
  totalPlayCount: basicInfoMock.totalPlayCount,
  totalLikeCount: basicInfoMock.totalLikeCount,
  totalFollowerCount: basicInfoMock.totalFollowerCount,
  recentItems: [],
})

describe('dashboard store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.restoreAllMocks())

  it('并发加载时只接受最新请求，旧请求 finally 不关闭 loading', async () => {
    let resolveOld!: (summary: DashboardSummary) => void
    let resolveLatest!: (summary: DashboardSummary) => void
    const oldRequest = new Promise<DashboardSummary>((resolve) => { resolveOld = resolve })
    const latestRequest = new Promise<DashboardSummary>((resolve) => { resolveLatest = resolve })
    vi.spyOn(dashboardService, 'getSummary').mockReturnValueOnce(oldRequest).mockReturnValueOnce(latestRequest)
    const store = useDashboardStore()

    const firstLoad = store.load()
    const latestLoad = store.load()
    resolveOld(createSummary(1))
    await firstLoad

    expect(store.summary).toBeNull()
    expect(store.loading).toBe(true)

    resolveLatest(createSummary(2))
    await latestLoad

    expect(store.summary?.userCount).toBe(2)
    expect(store.loading).toBe(false)
  })

  it('加载失败时吸收异常、设置 error 并复位 loading', async () => {
    vi.spyOn(dashboardService, 'getSummary').mockRejectedValue(new Error('读取失败'))
    const store = useDashboardStore()

    await expect(store.load()).resolves.toBeUndefined()

    expect(store.error).toBe('读取失败')
    expect(store.loading).toBe(false)
  })
})
