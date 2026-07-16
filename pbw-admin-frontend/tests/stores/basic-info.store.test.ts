import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { basicInfoMock } from '@/mocks/data/database.mock'
import { basicInfoRepository } from '@/mocks/repositories'
import { useBasicInfoStore } from '@/stores/basic-info.store'

describe('basic info store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.restoreAllMocks())

  it('加载成功后设置 info', async () => {
    const store = useBasicInfoStore()
    const sameStore = useBasicInfoStore()

    expect(sameStore).toBe(store)

    await store.load()

    expect(store.info).toEqual(basicInfoMock)
    expect(store.loading).toBe(false)
  })

  it('repository.get 失败时仍复位 loading 并继续抛出', async () => {
    const failure = new Error('读取失败')
    vi.spyOn(basicInfoRepository, 'get').mockRejectedValue(failure)
    const store = useBasicInfoStore()

    await expect(store.load()).rejects.toBe(failure)

    expect(store.error).toBe('读取失败')
    expect(store.loading).toBe(false)
  })

  it('repository.get 以非 Error rejection 失败时记录兜底错误', async () => {
    vi.spyOn(basicInfoRepository, 'get').mockRejectedValue('读取失败')
    const store = useBasicInfoStore()

    await expect(store.load()).rejects.toBe('读取失败')

    expect(store.error).toBe('基本信息加载失败')
    expect(store.loading).toBe(false)
  })
})
