import { describe, expect, it, vi } from 'vitest'
import type { UserProfile } from '@/models/entities'
import type { ListRepository } from '@/repositories/contracts'
import {
  createEntityServices,
  courseService,
  materialService,
  matrixAccountService,
  userService,
  videoService,
} from '@/services/entities'
import {
  courseRepository,
  materialRepository,
  matrixAccountRepository,
  userRepository,
  videoRepository,
} from '@/mocks/repositories'

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

  it('允许注入自定义 repository 替换默认服务绑定', async () => {
    const customUser: UserProfile = { id: 99 } as UserProfile
    const customUserRepository: ListRepository<UserProfile> = {
      list: vi.fn().mockResolvedValue([customUser]),
      remove: vi.fn().mockResolvedValue(undefined),
    }
    const services = createEntityServices({
      userRepository: customUserRepository,
      videoRepository,
      materialRepository,
      matrixAccountRepository,
      courseRepository,
    })

    await expect(services.userService.list()).resolves.toEqual([customUser])
    expect(customUserRepository.list).toHaveBeenCalledOnce()
  })
})
