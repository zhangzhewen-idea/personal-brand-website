import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContactQrModal from './ContactQrModal.vue'

describe('ContactQrModal', () => {
  it('显示二维码和联系说明', () => {
    const wrapper = mount(ContactQrModal, {
      props: {
        open: true,
        title: '购买模板',
        description: '扫码询价与购买',
        qrCodeUrl: '/qr.jpg',
      },
      global: { stubs: { Teleport: true } },
    })

    expect(wrapper.get('img').attributes('src')).toBe('/qr.jpg')
    expect(wrapper.get('img').attributes('alt')).toBe('联系二维码')
    expect(wrapper.text()).toContain('扫码询价与购买')
  })

  it('二维码未配置时显示明确提示', () => {
    const wrapper = mount(ContactQrModal, {
      props: {
        open: true,
        title: '立即咨询',
        description: '扫码咨询',
        qrCodeUrl: null,
      },
      global: { stubs: { Teleport: true } },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('暂未配置联系二维码')
  })
})
