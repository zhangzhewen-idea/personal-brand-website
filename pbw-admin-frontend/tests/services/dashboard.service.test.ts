import { describe, expect, it } from 'vitest'
import { basicInfoMock, coursesMock, materialsMock, matrixAccountsMock, usersMock, videosMock } from '@/mocks/data/database.mock'
import { createDashboardService } from '@/services/dashboard.service'

describe('dashboard service', () => {
  it('并行聚合六类数据并计算工作台指标', async () => {
    const service = createDashboardService({
      userService: { list: async () => usersMock },
      videoService: { list: async () => videosMock },
      materialService: { list: async () => materialsMock },
      matrixAccountService: { list: async () => matrixAccountsMock },
      courseService: { list: async () => coursesMock },
      basicInfoService: { get: async () => basicInfoMock },
    })

    await expect(service.getSummary()).resolves.toMatchObject({
      userCount: 3,
      videoCount: 3,
      materialCount: 3,
      materialTotalPrice: 127.9,
      matrixAccountCount: 3,
      courseCount: 3,
      onlineCourseCount: 2,
      totalPlayCount: 12800000,
      totalLikeCount: 860000,
      totalFollowerCount: 240000,
    })
  })

  it('所有列表为空时安全返回零值和空的最近更新', async () => {
    const service = createDashboardService({
      userService: { list: async () => [] },
      videoService: { list: async () => [] },
      materialService: { list: async () => [] },
      matrixAccountService: { list: async () => [] },
      courseService: { list: async () => [] },
      basicInfoService: { get: async () => ({ ...basicInfoMock, totalPlayCount: 0, totalLikeCount: 0, totalFollowerCount: 0 }) },
    })

    await expect(service.getSummary()).resolves.toMatchObject({
      userCount: 0,
      videoCount: 0,
      materialCount: 0,
      materialTotalPrice: 0,
      matrixAccountCount: 0,
      courseCount: 0,
      onlineCourseCount: 0,
      recentItems: [],
    })
  })
})
