import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  coursesMock,
  materialsMock,
  matrixAccountsMock,
  usersMock,
  videosMock,
} from '@/mocks/data/database.mock'
import {
  useCourseStore,
  useMaterialStore,
  useMatrixAccountStore,
  useUserStore,
  useVideoStore,
} from '@/stores/entities'
import {
  courseRepository,
  materialRepository,
  matrixAccountRepository,
  userRepository,
  videoRepository,
} from '@/mocks/repositories'

describe('entity stores', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await Promise.all([
      userRepository.reset(),
      videoRepository.reset(),
      materialRepository.reset(),
      matrixAccountRepository.reset(),
      courseRepository.reset(),
    ])
  })

  it.each([
    ['用户', useUserStore, usersMock],
    ['视频', useVideoStore, videosMock],
    ['素材', useMaterialStore, materialsMock],
    ['矩阵账号', useMatrixAccountStore, matrixAccountsMock],
    ['课程', useCourseStore, coursesMock],
  ] as const)('%s store 加载对应三条 mock 数据', async (_label, useStore, expected) => {
    const store = useStore()

    await store.load()

    expect(store.items).toEqual(expected)
    expect(store.items).toHaveLength(3)
  })

  it.each([
    ['用户', useUserStore, userRepository],
    ['视频', useVideoStore, videoRepository],
    ['素材', useMaterialStore, materialRepository],
    ['矩阵账号', useMatrixAccountStore, matrixAccountRepository],
    ['课程', useCourseStore, courseRepository],
  ] as const)('%s store 删除后对应 mock 列表少一条', async (_label, useStore, repository) => {
    const store = useStore()
    await store.load()

    await store.remove(1)

    expect(store.items).toHaveLength(2)
    await expect(repository.list()).resolves.toHaveLength(2)
  })

  it('删除后 repository reset 并重新加载时，同 id 可以重新出现', async () => {
    const store = useUserStore()

    await store.load()
    await store.remove(1)
    await userRepository.reset()
    await store.load()

    expect(store.items).toHaveLength(3)
    expect(store.items.some((item) => item.id === 1)).toBe(true)
  })
})
