import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { createAppRouter } from '@/router'

describe('完整页面路由', () => {
  it.each([
    ['/', '把热爱拍成作品'],
    ['/services', '课程体系'],
    ['/consulting', '商业剪辑服务'],
    ['/about', '成长里程碑'],
    ['/login', '欢迎回来'],
  ])('%s 渲染核心内容', async (path, expectedText) => {
    const router = createAppRouter(createMemoryHistory())
    await router.push(path)
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [createPinia(), router] } })
    await flushPromises()

    expect(wrapper.text()).toContain(expectedText)
    wrapper.unmount()
  })
})
