import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { useSiteStore } from '@/stores/site'
import { basicInfoFixture, onlineCourseFixture } from '@/test/fixtures'
import ServicesView from './ServicesView.vue'

describe('ServicesView', () => {
  it('已上线课程使用绿色报名按钮并显示顾问二维码', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useSiteStore()
    store.$patch({ basicInfo: basicInfoFixture, courses: [onlineCourseFixture] })
    vi.spyOn(store, 'loadCourses').mockResolvedValue()
    vi.spyOn(store, 'loadBasicInfo').mockResolvedValue()
    const wrapper = mount(ServicesView, {
      global: { plugins: [pinia], stubs: { Teleport: true } },
    })
    await flushPromises()

    const signupButton = wrapper.findAll('button')
      .find((button) => button.text() === '立即报名')
    expect(signupButton?.attributes('disabled')).toBeUndefined()
    expect(signupButton?.classes()).toContain('bg-green-600')

    await signupButton?.trigger('click')

    expect(wrapper.text()).toContain('联系顾问参加课程')
    expect(wrapper.get('img[alt="联系二维码"]').attributes('src'))
      .toBe('http://localhost/contact-qr.jpg')
  })
})
