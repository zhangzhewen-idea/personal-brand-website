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
    expect(store.successMessage).toBeNull()
  })

  it('加载失败时记录中文错误但不抛出并复位 loading', async () => {
    const service = {
      list: vi.fn().mockRejectedValue(new Error('接口异常')),
      remove: vi.fn(),
    }
    const store = createEntityListStore<TestEntity>('test-list-error', service)()
    store.successMessage = '旧成功消息'

    await expect(store.load()).resolves.toBeUndefined()

    expect(store.error).toBe('加载列表失败，请稍后重试')
    expect(store.successMessage).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('加载失败为非 Error rejection 时记录兜底错误并复位 loading', async () => {
    const service = {
      list: vi.fn().mockRejectedValue('接口异常'),
      remove: vi.fn(),
    }
    const store = createEntityListStore<TestEntity>('test-list-non-error', service)()
    store.successMessage = '旧成功消息'

    await expect(store.load()).resolves.toBeUndefined()

    expect(store.error).toBe('数据加载失败')
    expect(store.successMessage).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('两个 load 逆序返回时最终采用后一次结果', async () => {
    let resolveFirst!: (items: TestEntity[]) => void
    let resolveSecond!: (items: TestEntity[]) => void
    const service = {
      list: vi
        .fn()
        .mockImplementationOnce(
          () => new Promise<TestEntity[]>((resolve) => { resolveFirst = resolve }),
        )
        .mockImplementationOnce(
          () => new Promise<TestEntity[]>((resolve) => { resolveSecond = resolve }),
        ),
      remove: vi.fn(),
    }
    const store = createEntityListStore<TestEntity>('test-list-race', service)()

    const firstLoad = store.load()
    const secondLoad = store.load()
    resolveSecond([{ id: 2, name: 'second' }])
    await secondLoad
    resolveFirst([{ id: 1, name: 'first' }])
    await firstLoad

    expect(store.items).toEqual([{ id: 2, name: 'second' }])
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
    expect(store.successMessage).toBe('删除成功')
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
    store.successMessage = '旧成功消息'

    await expect(store.remove(1)).rejects.toBe(failure)

    expect(store.items).toEqual([{ id: 1, name: 'one' }])
    expect(store.error).toBe('删除失败')
    expect(store.successMessage).toBeNull()
    expect(store.submittingId).toBeNull()
  })

  it('删除进行中时忽略重复 remove', async () => {
    const service = {
      list: vi.fn(),
      remove: vi.fn().mockResolvedValue(undefined),
    }
    const store = createEntityListStore<TestEntity>('test-remove-duplicate', service)()
    store.items = [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]

    const firstRemove = store.remove(1)
    await store.remove(2)
    await firstRemove

    expect(service.remove).toHaveBeenCalledOnce()
    expect(store.items).toEqual([{ id: 2, name: 'two' }])
    expect(store.submittingId).toBeNull()
  })

  it('load 未完成时删除成功，旧 load 结果不能恢复已删除项目', async () => {
    let resolveLoad!: (items: TestEntity[]) => void
    const service = {
      list: vi.fn().mockImplementation(
        () => new Promise<TestEntity[]>((resolve) => { resolveLoad = resolve }),
      ),
      remove: vi.fn().mockResolvedValue(undefined),
    }
    const store = createEntityListStore<TestEntity>('test-list-remove-race', service)()
    store.items = [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]

    const loading = store.load()
    const removing = store.remove(1)
    await removing
    resolveLoad([{ id: 1, name: 'one' }, { id: 2, name: 'two' }])
    await loading

    expect(store.items).toEqual([{ id: 2, name: 'two' }])
    expect(store.successMessage).toBe('删除成功')
    expect(store.loading).toBe(false)
    expect(store.submittingId).toBeNull()
  })
})
