import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter, RouterLink } from 'vue-router'
import AppNavigation from './AppNavigation.vue'

describe('AppNavigation', () => {
  it('只高亮当前导航', async () => {
    const routes = [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/services', name: 'services', component: { template: '<div />' } },
      { path: '/consulting', name: 'consulting', component: { template: '<div />' } },
      { path: '/about', name: 'about', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
    ]
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/consulting')
    await router.isReady()

    const wrapper = mount(AppNavigation, {
      global: { plugins: [createPinia(), router] },
    })
    const navigationLinks = wrapper.findAllComponents(RouterLink)
      .filter((link) => ['作品展示', '服务', '商业咨询', '关于我'].includes(link.text()))

    expect(navigationLinks).toHaveLength(4)
    for (const link of navigationLinks) {
      expect(link.props('exactActiveClass')).toBe('!font-medium !text-blue-600')
      expect(link.props('activeClass')).toBeUndefined()
    }
  })
})
