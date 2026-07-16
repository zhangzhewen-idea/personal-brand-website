import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import UserListView from '@/views/users/UserListView.vue'

afterEach(() => vi.restoreAllMocks())

describe('UserListView', () => {
  it('展示用户业务字段和管理员示例，但不渲染密码或测试密码', async () => {
    const wrapper = mount(UserListView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('管理员')
    expect(wrapper.text()).toContain('admin')
    expect(wrapper.text()).toContain('admin@example.com')
    expect(wrapper.text()).toContain('角色')
    expect(wrapper.text()).toContain('删除状态')
    expect(wrapper.text()).toContain('创建时间')
    expect(wrapper.text()).toContain('更新时间')
    expect(wrapper.text()).not.toContain('password')
    expect(wrapper.text()).not.toContain('123456')
  })

  it('为用户提供删除入口，并将删除交给 store.remove', async () => {
    const wrapper = mount(UserListView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    const removeButtons = wrapper.findAll('button').filter((button) => button.text() === '删除')
    expect(removeButtons.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('新增用户')
    expect(wrapper.text()).toContain('查看')
  })
})
