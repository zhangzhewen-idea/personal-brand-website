import { describe, expect, it } from 'vitest'
import {
  courseService,
  materialService,
  matrixAccountService,
  userService,
  videoService,
} from '@/services/entities'

describe('entity services', () => {
  it.each([
    ['用户', userService],
    ['视频', videoService],
    ['素材', materialService],
    ['矩阵账号', matrixAccountService],
    ['课程', courseService],
  ] as const)('%s service 绑定对应 repository', async (_label, service) => {
    await expect(service.list()).resolves.toHaveLength(3)
  })
})
