import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import DashboardView from '@/views/dashboard/DashboardView.vue'

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
})
