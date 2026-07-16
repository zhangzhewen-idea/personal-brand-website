import axios, { AxiosError } from 'axios'
import { afterEach, describe, expect, test } from 'vitest'
import { http, normalizeHttpError } from '@/api/http'

describe('http', () => {
  const originalAdapter = http.defaults.adapter

  afterEach(() => {
    http.defaults.adapter = originalAdapter
  })

  test('接口 message 优先转换为稳定错误并保留 status', async () => {
    http.defaults.adapter = async (config) => {
      throw new AxiosError(
        'request failed',
        'ERR_BAD_REQUEST',
        config,
        undefined,
        {
          status: 422,
          statusText: 'Unprocessable Entity',
          headers: {},
          config,
          data: { message: '账号已存在' },
        },
      )
    }

    await expect(http.get('/users')).rejects.toMatchObject({
      message: '账号已存在',
      status: 422,
    })
  })

  test('未知错误使用稳定中文提示', () => {
    const error = normalizeHttpError(Symbol('unknown'))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('网络请求失败，请稍后重试')
    expect(error.status).toBeUndefined()
  })

  test('统一实例使用 /api 和 10000ms 配置', () => {
    expect(http.defaults.baseURL).toBe('/api')
    expect(http.defaults.timeout).toBe(10000)
    expect(axios.isAxiosError(http)).toBe(false)
  })
})
