import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/stores/auth.store'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
  })

  it('登录后同步 token、用户和认证状态', async () => {
    const store = useAuthStore()

    await store.login({ account: 'admin', password: '123456', testMode: true })

    expect(store.token).toBe('pbw-admin-test-token')
    expect(store.user?.account).toBe('admin')
    expect(store.isAuthenticated).toBe(true)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('登录失败后保留错误并继续抛出', async () => {
    const store = useAuthStore()
    await store.login({ account: 'admin', password: '123456', testMode: true })

    await expect(store.login({ account: 'admin', password: 'wrong', testMode: true })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    })

    expect(store.error?.code).toBe('INVALID_CREDENTIALS')
    expect(store.loading).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('初始化时恢复持久化会话', async () => {
    const firstStore = useAuthStore()
    await firstStore.login({ account: 'admin', password: '123456', testMode: true })

    setActivePinia(createPinia())
    const restoredStore = useAuthStore()

    expect(restoredStore.isAuthenticated).toBe(true)
    expect(restoredStore.token).toBe('pbw-admin-test-token')
    expect(restoredStore.user?.account).toBe('admin')
  })

  it('退出登录后清理状态', async () => {
    const store = useAuthStore()
    await store.login({ account: 'admin', password: '123456', testMode: true })

    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
