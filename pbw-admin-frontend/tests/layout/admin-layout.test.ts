import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { createAppRouter } from '@/router'

describe('AdminLayout', () => {
  afterEach(() => { document.body.querySelector('.mobile-menu-drawer')?.remove() })

  it('展示侧栏菜单、顶栏管理员信息和路由内容出口', async () => {
    const pinia = createPinia()
    const router = createAppRouter(pinia)
    await router.push('/login')
    const wrapper = mount(AdminLayout, { global: { plugins: [pinia, router] } })

    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('用户管理')
    expect(wrapper.text()).toContain('基本信息')
    expect(wrapper.text()).toContain('管理员')
    expect(wrapper.find('[data-testid="admin-layout-content"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="mobile-menu-button"]').attributes('aria-label')).toBe('打开菜单')
    expect(wrapper.get('[data-testid="sidebar-collapse"]').attributes('aria-label')).toBe('折叠侧栏')
  })

  it('支持桌面侧栏折叠并保留内容区域', async () => {
    const pinia = createPinia()
    const router = createAppRouter(pinia)
    const wrapper = mount(AdminLayout, { global: { plugins: [pinia, router] } })

    await wrapper.get('[data-testid="sidebar-collapse"]').trigger('click')

    expect(wrapper.find('[data-testid="admin-sidebar"]').classes()).toContain('is-collapsed')
    expect(wrapper.find('[data-testid="admin-layout-content"]').exists()).toBe(true)
  })

  it('drawer 使用独立实例并覆盖移动端桌面隐藏规则', async () => {
    const pinia = createPinia()
    const router = createAppRouter(pinia)
    const wrapper = mount(AdminLayout, { global: { plugins: [pinia, router] } })

    await wrapper.get('[data-testid="mobile-menu-button"]').trigger('click')
    await flushPromises()

    await vi.waitFor(() => expect(wrapper.find('.mobile-menu-drawer .admin-sidebar.is-mobile-drawer').exists()).toBe(true))
  })
})
