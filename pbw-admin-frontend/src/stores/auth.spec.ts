import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '@/api/modules/auth'
import { useAuthStore } from './auth'

vi.mock('@/api/modules/auth', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('登录成功后保存会话', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      data: {
        token: 'admin-token',
        expiresIn: 3600,
        nickname: '管理员',
        role: '管理员',
      },
    } as Awaited<ReturnType<typeof authApi.login>>)
    const store = useAuthStore()

    await store.login('admin', '123456')

    expect(authApi.login).toHaveBeenCalledWith({ account: 'admin', password: '123456' })
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.nickname).toBe('管理员')
    expect(localStorage.getItem('pbw-admin-token')).toBe('admin-token')
  })

  it('退出接口失败时仍清除本地会话', async () => {
    localStorage.setItem('pbw-admin-token', 'expired-token')
    localStorage.setItem('pbw-admin-user', JSON.stringify({ nickname: '管理员', role: '管理员' }))
    vi.mocked(authApi.logout).mockRejectedValue(new Error('network error'))
    const store = useAuthStore()

    await expect(store.logout()).rejects.toThrow('network error')

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(localStorage.getItem('pbw-admin-token')).toBeNull()
  })
})
