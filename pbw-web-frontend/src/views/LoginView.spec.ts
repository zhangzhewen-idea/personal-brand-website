import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import { useSiteStore } from '@/stores/site'
import LoginView from './LoginView.vue'

describe('LoginView', () => {
  it('注册账号格式错误时显示具体规则', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSiteStore()
    vi.spyOn(store, 'loadBasicInfo').mockResolvedValue()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }, { path: '/login', component: LoginView }],
    })
    await router.push('/login')
    await router.isReady()

    const wrapper = mount(LoginView, { global: { plugins: [pinia, router] } })
    const registerButton = wrapper.findAll('button').find(button => button.text() === '注册')
    expect(registerButton).toBeDefined()
    await registerButton!.trigger('click')
    await wrapper.get('input[name="account"]').setValue('1')

    const accountInput = wrapper.get('input[name="account"]').element as HTMLInputElement
    expect(accountInput.checkValidity()).toBe(false)
    expect(accountInput.validationMessage).toBe('账号须为 3-32 位，只能包含英文字母、数字和下划线，且必须以字母或数字开头')

    await wrapper.get('input[name="account"]').setValue('creator_01')
    await flushPromises()
    expect(accountInput.validationMessage).toBe('')
  })

  it('找回密码页面仅提示输入邮箱', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSiteStore()
    vi.spyOn(store, 'loadBasicInfo').mockResolvedValue()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }, { path: '/login', component: LoginView }],
    })
    await router.push('/login')
    await router.isReady()

    const wrapper = mount(LoginView, { global: { plugins: [pinia, router] } })
    const forgotButton = wrapper.findAll('button').find(button => button.text() === '忘记密码?')
    expect(forgotButton).toBeDefined()
    await forgotButton!.trigger('click')

    const emailInput = wrapper.get('input[name="accountOrEmail"]')
    expect(emailInput.attributes('type')).toBe('email')
    expect(emailInput.attributes('placeholder')).toBe('请输入邮箱')
    expect(wrapper.text()).toContain('输入邮箱以接收重置邮件')
    expect(wrapper.text()).not.toContain('账号或邮箱')
  })
})
