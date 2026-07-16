import { describe, expect, it, vi } from 'vitest'
import { basicInfoRepository } from '@/mocks/repositories'
import { basicInfoService } from '@/services/basic-info.service'

describe('basic info service', () => {
  it('封装并转发 basicInfoRepository.get', async () => {
    const info = { id: 1 }
    const get = vi.spyOn(basicInfoRepository, 'get').mockResolvedValue(info as never)

    await expect(basicInfoService.get()).resolves.toBe(info)
    expect(get).toHaveBeenCalledOnce()
  })
})
