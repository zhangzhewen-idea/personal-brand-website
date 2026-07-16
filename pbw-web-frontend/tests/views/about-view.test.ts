import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AboutView from '@/views/AboutView.vue'
import { getHomeContent } from '@/services/site.service'
import * as siteService from '@/services/site.service'
import { milestones } from '@/configs/about.config'
import { useSiteStore } from '@/stores/site.store'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AboutView', () => {
  it('renders the creator profile and matrix accounts from the site store', async () => {
    const content = await getHomeContent()
    const wrapper = mount(AboutView)
    await flushPromises()

    expect(useSiteStore().status).toBe('success')
    expect(wrapper.find('[data-testid="about-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="about-hero"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="author-photo"] img').attributes('src')).toBe(content.basicInfo.authorPhoto)
    expect(wrapper.text()).toContain(content.basicInfo.authorIdentityTag)
    expect(wrapper.text()).toContain('关于我')
    expect(wrapper.text()).toContain(content.basicInfo.slogan)
    expect(wrapper.findAll('[data-testid="about-matrix-card"]')).toHaveLength(content.matrixAccounts.length)
    expect(wrapper.text()).toContain(content.matrixAccounts[0].platformName)
  })

  it('renders three formatted creator stats and four configured milestones', async () => {
    const wrapper = mount(AboutView)
    await flushPromises()

    expect(wrapper.findAll('[data-testid="creator-stat"]')).toHaveLength(3)
    expect(wrapper.text()).toContain('1000万+')
    expect(wrapper.text()).toContain('50万+')
    expect(wrapper.text()).toContain('20万+')
    expect(wrapper.findAll('[data-testid="milestone"]')).toHaveLength(milestones.length)
    for (const milestone of milestones) {
      expect(wrapper.text()).toContain(String(milestone.year))
      expect(wrapper.text()).toContain(milestone.title)
      expect(wrapper.text()).toContain(milestone.description)
    }
  })

  it('renders three backstage images, film lists, directors, and contact details', async () => {
    const content = await getHomeContent()
    const wrapper = mount(AboutView)
    await flushPromises()

    expect(wrapper.findAll('[data-testid="behind-scenes-image"]')).toHaveLength(3)
    expect(wrapper.findAll('[data-testid="behind-scenes-image"] img')).toHaveLength(3)
    expect(wrapper.text()).toContain('年度十佳')
    expect(wrapper.text()).toContain('幕后故事')
    expect(content.basicInfo.annualTop10Films.length).toBeGreaterThanOrEqual(10)
    expect(content.basicInfo.annualTop10Films).toHaveLength(10)
    expect(wrapper.find('ol').findAll('li')).toHaveLength(10)
    expect(wrapper.text()).toContain(content.basicInfo.annualTop10Films[0])
    expect(wrapper.text()).toContain('三位导演')
    expect(wrapper.text()).toContain(content.basicInfo.influentialThreeDirectors[0])
    expect(wrapper.find('[data-testid="contact-email"]').attributes('href')).toBe(`mailto:${content.basicInfo.contactEmail}`)
    expect(wrapper.find('[data-testid="contact-qr-code"]').attributes('src')).toBe(content.basicInfo.contactQrCode)
    expect(wrapper.text()).toContain('联系方式')
    expect(wrapper.text()).toContain(content.basicInfo.contactInfo)
  })

  it('keeps the content grids responsive', async () => {
    const wrapper = mount(AboutView)
    await flushPromises()

    expect(wrapper.find('[data-testid="creator-stats-grid"]').classes()).toEqual(expect.arrayContaining(['grid', 'sm:grid-cols-3']))
    expect(wrapper.find('[data-testid="milestones-grid"]').classes()).toEqual(expect.arrayContaining(['grid', 'md:grid-cols-4']))
    expect(wrapper.find('[data-testid="behind-scenes-grid"]').classes()).toEqual(expect.arrayContaining(['grid', 'md:grid-cols-3']))
    expect(wrapper.find('[data-testid="about-matrix-grid"]').classes()).toEqual(expect.arrayContaining(['grid', 'sm:grid-cols-2', 'lg:grid-cols-4']))
  })

  it('shows loading state while the store request is pending', () => {
    vi.spyOn(siteService, 'getHomeContent').mockReturnValueOnce(new Promise(() => undefined))

    const wrapper = mount(AboutView)

    expect(wrapper.find('[data-testid="about-loading"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('shows the store error message when the service fails', async () => {
    vi.spyOn(siteService, 'getHomeContent').mockRejectedValueOnce(new Error('关于页内容加载失败'))

    const wrapper = mount(AboutView)
    await flushPromises()

    expect(wrapper.find('[data-testid="about-error"]').text()).toContain('关于页内容加载失败')
  })
})
