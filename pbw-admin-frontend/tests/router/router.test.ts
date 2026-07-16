import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { createAppRouter } from '@/router'
import { useAuthStore } from '@/stores/auth.store'

describe('后台路由', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  afterEach(() => sessionStorage.clear())

  it('未登录访问后台会被守卫重定向到登录页', async () => {
    const pinia = createPinia()
    const router = createAppRouter(pinia)

    await router.push('/dashboard')

    expect(router.currentRoute.value.fullPath).toBe('/login')
  })

  it('登录后访问登录页会被守卫重定向到仪表盘', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    await useAuthStore(pinia).login({ account: 'admin', password: '123456', testMode: true })
    const router = createAppRouter(pinia)

    await router.push('/login')

    expect(router.currentRoute.value.fullPath).toBe('/dashboard')
  })

  it('注册后台菜单对应的懒加载路由并提供中文标题', () => {
    const router = createAppRouter(createPinia())
    const paths = router.getRoutes().map((route) => route.path)

    expect(paths).toEqual(expect.arrayContaining([
      '/login', '/dashboard', '/users', '/content/basic-info', '/content/videos',
      '/content/materials', '/content/matrix-accounts', '/content/courses',
    ]))
    expect(router.getRoutes().find((route) => route.path === '/users')?.meta.title).toBe('用户管理')
  })

  it('根路径通过父路由 children 的空路径稳定进入仪表盘', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    await useAuthStore(pinia).login({ account: 'admin', password: '123456', testMode: true })
    const router = createAppRouter(pinia)

    await router.push('/')

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
