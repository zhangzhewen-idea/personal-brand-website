import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userService } from '@/services/entities'
import { useUserStore } from '@/stores/entities'
import UserListView from '@/views/users/UserListView.vue'

afterEach(() => vi.restoreAllMocks())

describe('UserListView', () => {
  it('展示用户业务字段和管理员示例，但不渲染密码或测试密码', async () => {
    const wrapper = mount(UserListView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('ID')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('管理员')
    expect(wrapper.text()).toContain('admin')
    expect(wrapper.text()).toContain('admin@example.com')
    expect(wrapper.find('img[src="https://cdn.example.com/avatars/admin.jpg"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('角色')
    expect(wrapper.text()).toContain('删除状态')
    expect(wrapper.text()).toContain('创建时间')
    expect(wrapper.text()).toContain('更新时间')
    expect(wrapper.text()).not.toContain('password')
    expect(wrapper.text()).not.toContain('123456')
  })

  it('为用户提供删除入口，触发删除回调后调用对应 store.remove', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const userStore = useUserStore()
    const remove = vi.spyOn(userStore, 'remove').mockResolvedValue(undefined)
    const wrapper = mount(UserListView, {
      global: {
        plugins: [pinia],
        stubs: {
          DeleteAction: {
            props: ['onDelete', 'loading', 'title', 'buttonText'],
            template: '<button data-testid="delete-action" :data-title="title" @click="onDelete">{{ buttonText }}</button>',
          },
        },
      },
    })
    await flushPromises()

    await wrapper.get('[data-testid="delete-action"]').trigger('click')
    await flushPromises()

    expect(wrapper.get('[data-testid="delete-action"]').attributes('data-title')).toBe('1 · 管理员（admin）')
    expect(wrapper.get('[data-testid="delete-action"]').text()).toBe('删除')
    expect(remove).toHaveBeenCalledWith(1)
    expect(wrapper.text()).toContain('新增用户')
    expect(wrapper.text()).toContain('查看')
  })

  it('异步加载时显示列表 loading 状态', async () => {
    let resolveList!: (items: Awaited<ReturnType<typeof userService.list>>) => void
    vi.spyOn(userService, 'list').mockReturnValue(new Promise((resolve) => { resolveList = resolve }))
    const pinia = createPinia()
    setActivePinia(pinia)
    const userStore = useUserStore()
    const wrapper = mount(UserListView, { global: { plugins: [pinia] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.el-loading-mask').exists()).toBe(true)

    resolveList([])
    await flushPromises()
    expect(userStore.loading).toBe(false)
  })

  it('加载失败时显示错误提示，点击重试后重新加载用户列表', async () => {
    vi.spyOn(userService, 'list')
      .mockRejectedValueOnce(new Error('用户列表暂不可用'))
      .mockResolvedValueOnce([])
    const wrapper = mount(UserListView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('加载列表失败，请稍后重试')
    const retry = wrapper.findAll('button').find((button) => button.text().includes('重试'))
    expect(retry).toBeDefined()

    await retry!.trigger('click')
    await flushPromises()

    expect(userService.list).toHaveBeenCalledTimes(2)
  })
})
