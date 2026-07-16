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

describe('entity stores', () => {
  beforeEach(() => setActivePinia(createPinia()))

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
})
