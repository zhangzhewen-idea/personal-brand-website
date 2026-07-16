import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import ConsultingView from '@/views/ConsultingView.vue'
import { caseStudies, consultingServices, cooperationWorkflow } from '@/configs/consulting.config'

describe('ConsultingView', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the consulting hero and all configured service details', () => {
    const wrapper = mount(ConsultingView, { attachTo: document.body })

    expect(wrapper.find('[data-testid="consulting-view"]').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('商业剪辑服务')
    expect(wrapper.find('[data-testid="consulting-cta"]').text()).toContain('立即咨询')
    expect(wrapper.find('[data-testid="consulting-service-grid"]').classes()).toEqual(
      expect.arrayContaining(['grid', 'md:grid-cols-2', 'lg:grid-cols-4']),
    )
    expect(wrapper.findAll('[data-testid="consulting-service-card"]')).toHaveLength(consultingServices.length)

    for (const service of consultingServices) {
      expect(wrapper.text()).toContain(service.title)
      expect(wrapper.text()).toContain(service.description)
      expect(wrapper.text()).toContain(service.price)
      expect(wrapper.text()).toContain(service.duration)
      expect(wrapper.text()).toContain(service.features[0])
    }
  })

  it('renders the configured four-step workflow and three case studies responsively', () => {
    const wrapper = mount(ConsultingView)

    expect(wrapper.findAll('[data-testid="workflow-step"]')).toHaveLength(cooperationWorkflow.length)
    expect(wrapper.find('[data-testid="workflow-grid"]').classes()).toEqual(
      expect.arrayContaining(['grid', 'sm:grid-cols-2', 'lg:grid-cols-4']),
    )
    expect(wrapper.findAll('[data-testid="case-study"]')).toHaveLength(caseStudies.length)
    expect(wrapper.find('[data-testid="case-study-grid"]').classes()).toEqual(
      expect.arrayContaining(['grid', 'md:grid-cols-3']),
    )
  })

  it('opens a BaseDialog when the hero consultation button is clicked', async () => {
    const wrapper = mount(ConsultingView, { attachTo: document.body })

    await wrapper.find('[data-testid="consulting-cta"]').trigger('click')

    const dialog = document.body.querySelector('[data-testid="base-dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.textContent).toContain('微信')
    expect(dialog?.textContent).toContain('咨询')
  })
})
