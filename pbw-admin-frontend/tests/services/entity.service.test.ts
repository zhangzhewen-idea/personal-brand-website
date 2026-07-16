import { describe, expect, it, vi } from 'vitest'
import { AppError } from '@/services/app-error'
import { createEntityService } from '@/services/entity.service'
import type { ListRepository } from '@/repositories/contracts'

type TestEntity = { id: number; name: string }

const createRepository = (): ListRepository<TestEntity> => ({
  list: vi.fn(),
  remove: vi.fn(),
})

describe('entity service', () => {
  it('转发列表查询并在删除成功时完成', async () => {
    const repository = createRepository()
    vi.mocked(repository.list).mockResolvedValue([{ id: 1, name: 'one' }])
    vi.mocked(repository.remove).mockResolvedValue(undefined)
    const service = createEntityService(repository, '用户')

    await expect(service.list()).resolves.toEqual([{ id: 1, name: 'one' }])
    await expect(service.remove(1)).resolves.toBeUndefined()
  })

  it('记录不存在时转换为 NOT_FOUND AppError', async () => {
    const repository = createRepository()
    vi.mocked(repository.remove).mockRejectedValue(new Error('记录不存在'))
    const service = createEntityService(repository, '用户')

    await expect(service.remove(1)).rejects.toMatchObject(
      new AppError('记录不存在或已删除', 'NOT_FOUND'),
    )
  })

  it('其它删除错误转换为 DELETE_FAILED AppError', async () => {
    const repository = createRepository()
    vi.mocked(repository.remove).mockRejectedValue(new Error('network error'))
    const service = createEntityService(repository, '视频')

    await expect(service.remove(1)).rejects.toMatchObject(
      new AppError('删除视频失败，请稍后重试', 'DELETE_FAILED'),
    )
  })
})
