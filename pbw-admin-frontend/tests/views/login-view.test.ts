import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import LoginView from '@/views/auth/LoginView.vue'
import { createAppRouter } from '@/router'

describe('LoginView', () => {
  beforeEach(() => sessionStorage.clear())
  afterEach(() => sessionStorage.clear())

  const mountView = async () => {
    const pinia = createPinia()
    const router = createAppRouter(pinia)
    await router.push('/login')
    return { router, wrapper: mount(LoginView, { global: { plugins: [pinia, router] } }) }
  }

  it('展示临时测试模式和默认测试账号', async () => {
    const { wrapper } = await mountView()

    expect(wrapper.text()).toContain('临时测试模式')
    expect((wrapper.get('[data-testid="account-input"]').element as HTMLInputElement).value).toBe('admin')
    expect((wrapper.get('[data-testid="password-input"]').element as HTMLInputElement).value).toBe('123456')
  })

  it('使用真实 pinia 登录成功后进入仪表盘', async () => {
    const { router, wrapper } = await mountView()

    await wrapper.get('[data-testid="login-submit"]').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('错误账号显示错误提示且不离开登录页', async () => {
    const { router, wrapper } = await mountView()
    await wrapper.get('[data-testid="password-input"]').setValue('wrong')

    await wrapper.get('[data-testid="login-submit"]').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(router.currentRoute.value.path).toBe('/login')
    expect(wrapper.text()).toContain('账号或密码错误')
  })
})
