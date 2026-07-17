import { describe, expect, it } from 'vitest'
import { getEnvironmentConfig } from './environment.config'

describe('getEnvironmentConfig', () => {
  it('开发环境连接 8080 后端', () => {
    expect(getEnvironmentConfig('dev')).toEqual({
      apiBaseUrl: 'http://localhost:8080/api',
      mediaBaseUrl: 'http://localhost:8080',
      backendTarget: 'http://localhost:8080',
      backendPort: 8080,
    })
  })

  it('生产环境通过 HTTPS 域名连接后端', () => {
    expect(getEnvironmentConfig('prod')).toEqual({
      apiBaseUrl: 'https://pbw-backend1.harmonies.cc/api',
      mediaBaseUrl: 'https://pbw-backend1.harmonies.cc',
      backendTarget: 'https://pbw-backend1.harmonies.cc',
      backendPort: 8088,
    })
  })

  it('拒绝未定义的环境', () => {
    expect(() => getEnvironmentConfig('staging')).toThrow('不支持的运行环境: staging')
  })
})
