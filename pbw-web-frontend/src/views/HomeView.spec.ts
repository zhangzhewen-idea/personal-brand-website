import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSiteStore } from '@/stores/site'
import { basicInfoFixture, paidMaterialFixture, videoFixture } from '@/test/fixtures'
import HomeView from './HomeView.vue'

const mountHome = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useSiteStore()
  store.$patch({
    basicInfo: basicInfoFixture,
    videos: [videoFixture],
    materials: [paidMaterialFixture],
    matrixAccounts: [],
  })
  vi.spyOn(store, 'loadHome').mockResolvedValue()
  const wrapper = mount(HomeView, {
    global: { plugins: [pinia], stubs: { Teleport: true } },
  })
  await flushPromises()
  return wrapper
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HomeView', () => {
  it('点击封面播放按钮时在浮层播放视频', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => null)
    const wrapper = await mountHome()

    await wrapper.get('[aria-label="播放 测试视频"]').trigger('click')

    expect(wrapper.get('video').attributes('src')).toBe('/test.mp4')
    expect(wrapper.text()).toContain('测试视频')
  })

  it('点击观看完整视频时使用同一个浮层播放器', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => null)
    const wrapper = await mountHome()
    const fullVideoButton = wrapper.findAll('button')
      .find((button) => button.text().includes('观看完整视频'))

    await fullVideoButton?.trigger('click')

    expect(wrapper.get('video').attributes('src')).toBe('/test.mp4')
  })

  it('点击付费素材时显示联系二维码', async () => {
    const wrapper = await mountHome()
    const purchaseButton = wrapper.findAll('button')
      .find((button) => button.text() === '立即购买')

    await purchaseButton?.trigger('click')

    expect(wrapper.text()).toContain('扫码联系询问价格并购买')
    expect(wrapper.get('img[alt="联系二维码"]').attributes('src'))
      .toBe('/contact-qr.jpg')
  })
})
