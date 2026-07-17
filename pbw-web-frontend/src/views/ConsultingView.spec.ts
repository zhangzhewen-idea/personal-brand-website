import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { useSiteStore } from '@/stores/site'
import { basicInfoFixture } from '@/test/fixtures'
import ConsultingView from './ConsultingView.vue'

const mountConsulting = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useSiteStore()
  store.$patch({ basicInfo: basicInfoFixture })
  vi.spyOn(store, 'loadBasicInfo').mockResolvedValue()
  const wrapper = mount(ConsultingView, {
    global: { plugins: [pinia], stubs: { Teleport: true } },
  })
  await flushPromises()
  return wrapper
}

describe('ConsultingView', () => {
  it('移除成功案例区域', async () => {
    const wrapper = await mountConsulting()

    expect(wrapper.text()).not.toContain('成功案例')
  })

  it('顶部立即咨询显示联系二维码', async () => {
    const wrapper = await mountConsulting()
    const consultButton = wrapper.findAll('button')
      .find((button) => button.text().includes('立即咨询'))

    await consultButton?.trigger('click')

    expect(wrapper.text()).toContain('扫描二维码联系我们')
    expect(wrapper.get('img[alt="联系二维码"]').attributes('src'))
      .toBe('http://localhost/contact-qr.jpg')
  })

  it('所有咨询服务按钮都打开同一二维码弹窗', async () => {
    const wrapper = await mountConsulting()
    const serviceButtons = wrapper.findAll('button')
      .filter((button) => button.text() === '咨询服务')

    expect(serviceButtons).toHaveLength(4)
    for (const button of serviceButtons) {
      await button.trigger('click')
      expect(wrapper.find('img[alt="联系二维码"]').exists()).toBe(true)
      await wrapper.get('[aria-label="关闭"]').trigger('click')
    }
  })
})
