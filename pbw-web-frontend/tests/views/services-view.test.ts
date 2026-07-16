import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ServicesView from '@/views/ServicesView.vue'
import { getCourses } from '@/services/course.service'
import * as courseService from '@/services/course.service'
import { useCourseStore } from '@/stores/course.store'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ServicesView', () => {
  it('renders the course system heading and course cards with price, features, and responsive grid', async () => {
    const courses = await getCourses()
    const wrapper = mount(ServicesView, { attachTo: document.body })
    await flushPromises()

    expect(useCourseStore().status).toBe('success')
    expect(wrapper.find('[data-testid="services-view"]').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('课程体系')
    expect(wrapper.text()).toContain('系统化的剪辑课程，从入门到精通，助你成为优秀的视频创作者')
    expect(wrapper.find('[data-testid="course-grid"]').classes()).toEqual(
      expect.arrayContaining(['grid', 'md:grid-cols-2', 'lg:grid-cols-4']),
    )
    expect(wrapper.findAll('[data-testid="course-card"]')).toHaveLength(4)
    expect(wrapper.text()).toContain(courses[0].courseName)
    expect(wrapper.text()).toContain('¥199')
    expect(wrapper.text()).toContain(courses[0].features[0])
    expect(wrapper.find('[data-testid="course-status-online"]').text()).toContain('正在招生')
    expect(wrapper.find('[data-testid="course-status-offline"]').text()).toContain('即将上线')
    expect(wrapper.find('[data-testid="course-card"] button').text()).toContain('立即报名')
    const offlineCard = wrapper.findAll('[data-testid="course-card"]')[3]
    expect(offlineCard.text()).toContain('即将上线')
    expect(offlineCard.find('button').text()).toContain('敬请期待')
    expect(offlineCard.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('[data-testid="course-card"]')[0].find('div').classes()).toContain('bg-blue-500')
    wrapper.unmount()
  })

  it('shows loading state while the course store request is pending', () => {
    vi.spyOn(courseService, 'getCourses').mockReturnValueOnce(new Promise(() => undefined))

    const wrapper = mount(ServicesView)

    expect(wrapper.find('[data-testid="services-loading"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('shows the course store error message when loading fails', async () => {
    vi.spyOn(courseService, 'getCourses').mockRejectedValueOnce(new Error('课程读取失败'))

    const wrapper = mount(ServicesView)
    await flushPromises()

    expect(wrapper.find('[data-testid="services-error"]').text()).toContain('课程读取失败')
  })

  it('opens a BaseDialog for an online course enrollment request', async () => {
    const wrapper = mount(ServicesView, { attachTo: document.body })
    await flushPromises()

    await wrapper.find('[data-testid="course-card"] button').trigger('click')
    const dialog = document.body.querySelector('[data-testid="base-dialog"]')

    expect(dialog).not.toBeNull()
    expect(dialog?.textContent).toContain('短视频剪辑入门')
    expect(dialog?.textContent).toContain('报名功能将在支付服务接入后开放')
    wrapper.unmount()
  })
})
