import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { useSiteStore } from '@/stores/site'
import { basicInfoFixture } from '@/test/fixtures'
import AboutView from './AboutView.vue'

describe('AboutView', () => {
  it('发送邮件入口调用后端配置的邮箱并复制地址', async () => {
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

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    await emailLink.trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('contact@example.com')
    expect(wrapper.get('[role="status"]').text()).toContain('邮箱地址已复制')
  })
})
