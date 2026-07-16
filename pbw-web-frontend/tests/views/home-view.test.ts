import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HomeView from '@/views/HomeView.vue'
import { getHomeContent } from '@/services/site.service'
import * as siteService from '@/services/site.service'
import { useSiteStore } from '@/stores/site.store'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HomeView', () => {
  it('renders all four Service ViewModel cards through the real site store', async () => {
    const homeContent = await getHomeContent()
    const wrapper = mount(HomeView)
    await flushPromises()

    expect(useSiteStore().status).toBe('success')
    expect(wrapper.find('[data-testid="video-hero"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="video-gallery"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="material-library"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="matrix-accounts"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(homeContent.basicInfo.slogan)
    expect(wrapper.findAll('[data-testid="video-card"]')).toHaveLength(4)
    expect(wrapper.findAll('[data-testid="material-card"]')).toHaveLength(4)
    expect(wrapper.findAll('[data-testid="matrix-card"]')).toHaveLength(4)
    expect(wrapper.text()).toContain('观看作品集')
  })

  it('shows loading state while the real store request is pending', async () => {
    vi.spyOn(siteService, 'getHomeContent').mockReturnValueOnce(new Promise(() => undefined))

    const wrapper = mount(HomeView)
    expect(wrapper.find('[data-testid="home-loading"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('shows the store error message when the service fails', async () => {
    vi.spyOn(siteService, 'getHomeContent').mockRejectedValueOnce(new Error('首页内容加载失败'))

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.find('[data-testid="home-error"]').text()).toContain('首页内容加载失败')
  })

  it('opens a material dialog and closes it through BaseDialog', async () => {
    const wrapper = mount(HomeView, { attachTo: document.body })
    await flushPromises()

    await wrapper.find('[data-testid="material-card"] button').trigger('click')
    const dialog = document.body.querySelector('[data-testid="base-dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.textContent).toContain('影视剪辑音效素材包')

    ;(document.body.querySelector('[data-testid="dialog-close"]') as HTMLButtonElement).click()
    await flushPromises()
    expect(document.body.querySelector('[data-testid="base-dialog"]')).toBeNull()
    wrapper.unmount()
  })

  it('provides a down-scroll control that targets the video gallery', async () => {
    const wrapper = mount(HomeView)
    await flushPromises()

    const scrollButton = wrapper.find('[data-testid="hero-scroll-button"]')
    expect(scrollButton.attributes('aria-label')).toBe('向下查看视频')
    expect(scrollButton.attributes('href')).toBe('#video-gallery')
  })
})
