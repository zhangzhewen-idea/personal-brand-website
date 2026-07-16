import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import { mapBasicInfoDto } from '@/api/mappers/content.mapper'
import { basicInfoMock } from '@/mocks/content.mock'

describe('api boundary', () => {
  it('axios 实例使用统一前缀和超时', () => {
    expect(http.defaults.baseURL).toBe('/api')
    expect(http.defaults.timeout).toBe(10_000)
  })

  it('接口路径按业务域集中定义', () => {
    expect(endpoints).toEqual({
      basicInfo: '/basic-info',
      videos: '/videos',
      materials: '/materials',
      matrixAccounts: '/matrix-accounts',
      courses: '/courses',
      currentUser: '/users/me',
      login: '/auth/login',
      register: '/auth/register',
    })
  })

  it('mapper 返回数组字段的独立副本', () => {
    const mapped = mapBasicInfoDto(basicInfoMock)

    expect(mapped).not.toBe(basicInfoMock)
    expect(mapped.annualTop10Films).not.toBe(basicInfoMock.annualTop10Films)
  })
})
