import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AuthView from '@/views/AuthView.vue'

describe('AuthView', () => {
  it('renders the brand panel, auth tabs, and login fields by default', () => {
    const wrapper = mount(AuthView)

    expect(wrapper.find('[data-testid="auth-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="auth-brand-panel"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('欢迎回来')
    expect(wrapper.find('[data-tab="login"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="login-account"] input').attributes('name')).toBe('account')
    expect(wrapper.find('[data-testid="login-password"] input').attributes('name')).toBe('password')
    expect(wrapper.find('[data-testid="login-submit"]').text()).toContain('登录')
  })

  it('switches between login and register without navigating or calling an API', async () => {
    const wrapper = mount(AuthView)

    await wrapper.find('[data-tab="register"]').trigger('click')

    expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="register-nickname"] input').attributes('name')).toBe('nickname')
    expect(wrapper.find('[data-testid="register-account"] input').attributes('name')).toBe('account')
    expect(wrapper.find('[data-testid="register-email"] input').attributes('name')).toBe('email')
    expect(wrapper.find('[data-testid="register-password"] input').attributes('name')).toBe('password')
    expect(wrapper.find('[data-testid="register-confirm-password"] input').attributes('name')).toBe('confirmPassword')
    expect(wrapper.find('[data-testid="register-submit"]').text()).toContain('注册')
  })

  it('toggles login and register password visibility locally', async () => {
    const wrapper = mount(AuthView)

    const loginPassword = wrapper.find('[data-testid="login-password"] input')
    expect(loginPassword.attributes('type')).toBe('password')
    await wrapper.find('[data-testid="login-password-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="login-password"] input').attributes('type')).toBe('text')

    await wrapper.find('[data-tab="register"]').trigger('click')
    const registerPassword = wrapper.find('[data-testid="register-password"] input')
    const confirmPassword = wrapper.find('[data-testid="register-confirm-password"] input')
    expect(registerPassword.attributes('type')).toBe('password')
    expect(confirmPassword.attributes('type')).toBe('password')

    await wrapper.find('[data-testid="register-password-toggle"]').trigger('click')
    await wrapper.find('[data-testid="register-confirm-password-toggle"]').trigger('click')

    expect(wrapper.find('[data-testid="register-password"] input').attributes('type')).toBe('text')
    expect(wrapper.find('[data-testid="register-confirm-password"] input').attributes('type')).toBe('text')
  })
})
