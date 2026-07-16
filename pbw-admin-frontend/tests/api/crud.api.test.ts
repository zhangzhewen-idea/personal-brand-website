import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { http } from '@/api/http'
import { createCrudApi } from '@/api/modules/crud.api'

interface ExampleDto {
  id: number
}

const response = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as InternalAxiosRequestConfig,
})

describe('createCrudApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('list 支持裸数组响应', async () => {
    const items = [{ id: 1 }]
    vi.spyOn(http, 'get').mockResolvedValueOnce(response(items))
    const api = createCrudApi<ExampleDto>('/examples')

    await expect(api.list()).resolves.toEqual(items)
  })

  test('list 支持 data envelope 响应', async () => {
    const items = [{ id: 2 }]
    vi.spyOn(http, 'get').mockResolvedValueOnce(response({ data: items }))
    const api = createCrudApi<ExampleDto>('/examples')

    await expect(api.list()).resolves.toEqual(items)
  })

  test('remove 调用实体 id endpoint', async () => {
    const remove = vi.spyOn(http, 'delete').mockResolvedValueOnce(response(undefined))
    const api = createCrudApi<ExampleDto>('/examples')

    await api.remove(7)

    expect(remove).toHaveBeenCalledWith('/examples/7')
  })
})
