import { describe, expect, it } from 'vitest'
import { createAuthService } from '@/services/auth.service'
import { AppError } from '@/services/app-error'

const createStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

describe('auth service', () => {
  it('在测试模式下使用示例管理员登录并持久化不含密码的会话', async () => {
    const storage = createStorage()
    const service = createAuthService(storage)

    const session = await service.login({ account: 'admin', password: '123456', testMode: true })

    expect(session.token).toBe('pbw-admin-test-token')
    expect(session.user.account).toBe('admin')
    expect(session.user).not.toHaveProperty('password')
    expect(JSON.parse(storage.getItem('pbw-admin-session')!)).not.toHaveProperty('user.password')
    expect(service.restore()).toEqual(session)
  })

  it('测试模式下拒绝错误凭据', async () => {
    const service = createAuthService(createStorage())

    await expect(service.login({ account: 'admin', password: 'wrong', testMode: true }))
      .rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', message: '账号或密码错误' })
  })

  it('非测试模式下报告 API 不可用', async () => {
    const service = createAuthService(createStorage())

    await expect(service.login({ account: 'admin', password: '123456', testMode: false }))
      .rejects.toMatchObject({ code: 'API_UNAVAILABLE' })
  })

  it('退出登录会清除持久化会话', async () => {
    const storage = createStorage()
    const service = createAuthService(storage)
    await service.login({ account: 'admin', password: '123456', testMode: true })

    service.logout()

    expect(storage.getItem('pbw-admin-session')).toBeNull()
    expect(service.restore()).toBeNull()
  })

  it('恢复损坏的会话 JSON 时清除数据并返回 null', () => {
    const storage = createStorage()
    storage.setItem('pbw-admin-session', '{broken')
    const service = createAuthService(storage)

    expect(service.restore()).toBeNull()
    expect(storage.getItem('pbw-admin-session')).toBeNull()
  })

  it('AppError 暴露稳定错误码', () => {
    const error = new AppError('账号或密码错误', 'INVALID_CREDENTIALS')

    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe('INVALID_CREDENTIALS')
  })
})
