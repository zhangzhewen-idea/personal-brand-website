import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { useSiteStore } from '@/stores/site'
import { basicInfoFixture } from '@/test/fixtures'
import AboutView from './AboutView.vue'

describe('AboutView', () => {
  it('发送邮件入口调用后端配置的邮箱', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSiteStore()
    store.$patch({ basicInfo: basicInfoFixture, matrixAccounts: [] })
    vi.spyOn(store, 'loadBasicInfo').mockResolvedValue()
    vi.spyOn(store, 'loadMatrixAccounts').mockResolvedValue()
    const wrapper = mount(AboutView, { global: { plugins: [pinia] } })
    await flushPromises()

    const emailLink = wrapper.get('a[href^="mailto:"]')
    expect(emailLink.attributes('href')).toBe('mailto:contact@example.com')
    expect(emailLink.text()).toContain('发送邮件')
  })
})
