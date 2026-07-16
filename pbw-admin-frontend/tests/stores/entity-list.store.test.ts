import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEntityListStore } from '@/stores/entity-list.store'

type TestEntity = { id: number; name: string }

describe('entity list store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.restoreAllMocks())

  it('加载成功后写入 items 并复位 loading', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: 1, name: 'one' }]),
      remove: vi.fn(),
    }
    const store = createEntityListStore<TestEntity>('test-list', service)()

    const loading = store.load()
    expect(store.loading).toBe(true)
    await loading

    expect(store.items).toEqual([{ id: 1, name: 'one' }])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('加载失败时记录中文错误但不抛出并复位 loading', async () => {
    const service = {
      list: vi.fn().mockRejectedValue(new Error('接口异常')),
      remove: vi.fn(),
    }
    const store = createEntityListStore<TestEntity>('test-list-error', service)()

    await expect(store.load()).resolves.toBeUndefined()

    expect(store.error).toBe('加载列表失败，请稍后重试')
    expect(store.loading).toBe(false)
  })

  it('删除成功后才移除项目并复位 submittingId', async () => {
    const service = {
      list: vi.fn(),
      remove: vi.fn().mockResolvedValue(undefined),
    }
    const store = createEntityListStore<TestEntity>('test-remove', service)()
    store.items = [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]

    const removing = store.remove(1)
    expect(store.submittingId).toBe(1)
    await removing

    expect(store.items).toEqual([{ id: 2, name: 'two' }])
    expect(store.submittingId).toBeNull()
  })

  it('删除失败时保留列表、记录错误、继续抛出并复位 submittingId', async () => {
    const failure = new Error('删除失败')
    const service = {
      list: vi.fn(),
      remove: vi.fn().mockRejectedValue(failure),
    }
    const store = createEntityListStore<TestEntity>('test-remove-error', service)()
    store.items = [{ id: 1, name: 'one' }]

    await expect(store.remove(1)).rejects.toBe(failure)

    expect(store.items).toEqual([{ id: 1, name: 'one' }])
    expect(store.error).toBe('删除失败')
    expect(store.submittingId).toBeNull()
  })
})
