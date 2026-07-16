import { describe, expect, it } from 'vitest'
import { createAuthService } from '@/services/auth.service'
import { AppError } from '@/services/app-error'
import { usersMock } from '@/mocks/data/database.mock'

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

  it('登录和恢复都会清洗独立运行时用户对象中的 password', async () => {
    const storage = createStorage()
    const runtimeUser = { ...usersMock[0], password: 'runtime-secret' }
    const service = createAuthService(storage, [runtimeUser])

    const session = await service.login({ account: 'admin', password: '123456', testMode: true })
    const persisted = JSON.parse(storage.getItem('pbw-admin-session')!)

    expect(session.user).not.toHaveProperty('password')
    expect(persisted.user).not.toHaveProperty('password')
    expect(service.restore()?.user).not.toHaveProperty('password')
  })

  const invalidSessions: Array<[string, { token?: string; user?: Record<string, unknown> }]> = [
    ['空 token', { token: '  ' }],
    ['篡改 token', { token: 'tampered-token' }],
    ['普通用户', { user: { ...usersMock[1] } }],
    ['缺少 id', { user: { ...usersMock[0], id: undefined } }],
    ['空 account', { user: { ...usersMock[0], account: ' ' } }],
    ['空 nickname', { user: { ...usersMock[0], nickname: '' } }],
    ['非法 role', { user: { ...usersMock[0], role: '访客' } }],
    ['非法 createTime', { user: { ...usersMock[0], createTime: 1 } }],
    ['非法 updateTime', { user: { ...usersMock[0], updateTime: null } }],
    ['非法 isDeleted', { user: { ...usersMock[0], isDeleted: 'false' } }],
  ]

  it.each(invalidSessions)('恢复时拒绝%s并清除 session', (_, override) => {
    const storage = createStorage()
    storage.setItem('pbw-admin-session', JSON.stringify({
      token: 'token',
      user: { ...usersMock[0], ...(override.user ?? {}) },
      ...override,
    }))
    const service = createAuthService(storage)

    expect(service.restore()).toBeNull()
    expect(storage.getItem('pbw-admin-session')).toBeNull()
  })

  it('测试模式下拒绝错误凭据', async () => {
    const service = createAuthService(createStorage())

    await expect(service.login({ account: 'admin', password: 'wrong', testMode: true }))
      .rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', message: '账号或密码错误' })
  })

  it('测试用户不是管理员时报告 TEST_USER_MISSING', async () => {
    const service = createAuthService(createStorage(), [{ ...usersMock[0], role: '用户' }])

    await expect(service.login({ account: 'admin', password: '123456', testMode: true }))
      .rejects.toMatchObject({ code: 'TEST_USER_MISSING' })
  })

  it('已删除管理员不能登录', async () => {
    const service = createAuthService(createStorage(), [{ ...usersMock[0], isDeleted: true }])

    await expect(service.login({ account: 'admin', password: '123456', testMode: true }))
      .rejects.toMatchObject({ code: 'TEST_USER_MISSING' })
  })

  it('已删除管理员的 session 不能恢复并会被清理', () => {
    const storage = createStorage()
    storage.setItem('pbw-admin-session', JSON.stringify({
      token: 'pbw-admin-test-token',
      user: { ...usersMock[0], isDeleted: true },
    }))
    const service = createAuthService(storage)

    expect(service.restore()).toBeNull()
    expect(storage.getItem('pbw-admin-session')).toBeNull()
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

  it('存储读取抛异常时安全返回 null 并尝试清理', () => {
    let removed = false
    const storage = {
      getItem: () => {
        throw new Error('storage unavailable')
      },
      setItem: () => undefined,
      removeItem: () => {
        removed = true
        throw new Error('storage unavailable')
      },
    }
    const service = createAuthService(storage)

    expect(() => service.restore()).not.toThrow()
    expect(service.restore()).toBeNull()
    expect(removed).toBe(true)
  })

  it('会话写入抛异常时登录失败且不会留下可恢复 session', async () => {
    let removed = false
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('storage unavailable')
      },
      removeItem: () => {
        removed = true
      },
    }
    const service = createAuthService(storage)

    await expect(service.login({ account: 'admin', password: '123456', testMode: true }))
      .rejects.toMatchObject({ code: 'SESSION_PERSIST_FAILED' })
    expect(removed).toBe(true)
    expect(service.restore()).toBeNull()
  })

  it('AppError 暴露稳定错误码', () => {
    const error = new AppError('账号或密码错误', 'INVALID_CREDENTIALS')

    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe('INVALID_CREDENTIALS')
  })
})
