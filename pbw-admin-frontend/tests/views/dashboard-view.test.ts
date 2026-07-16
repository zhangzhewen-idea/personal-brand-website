import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { dashboardService } from '@/services/dashboard.service'
import DashboardView from '@/views/dashboard/DashboardView.vue'

afterEach(() => vi.restoreAllMocks())

describe('DashboardView', () => {
  it('展示工作台统计卡片和最近更新', async () => {
    const wrapper = mount(DashboardView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('用户总数')
    expect(wrapper.text()).toContain('视频数量')
    expect(wrapper.text()).toContain('素材总价')
    expect(wrapper.text()).toContain('已上线课程')
    expect(wrapper.text()).toContain('全网播放')
    expect(wrapper.text()).toContain('1280万')
    expect(wrapper.text()).toContain('为什么这部电影能封神')
  })

  it('加载失败时展示错误且不产生未处理 rejection', async () => {
    vi.spyOn(dashboardService, 'getSummary').mockRejectedValue(new Error('工作台暂不可用'))
    const wrapper = mount(DashboardView, { global: { plugins: [createPinia()] } })

    await expect(wrapper.vm.$nextTick()).resolves.toBeUndefined()
    await vi.waitFor(() => expect(wrapper.text()).toContain('工作台暂不可用'))
  })
})
