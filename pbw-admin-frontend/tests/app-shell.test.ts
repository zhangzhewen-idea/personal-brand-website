import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('提供后台应用路由出口', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<main data-testid="router-view" />' },
        },
      },
    })

    expect(wrapper.get('[data-testid="app-shell"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="router-view"]').exists()).toBe(true)
  })
})
