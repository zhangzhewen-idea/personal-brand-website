import { nextTick } from 'vue'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, type Router } from 'vue-router'
import Footer from '@/components/layout/Footer.vue'
import Navigation from '@/components/layout/Navigation.vue'
import AboutView from '@/views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'
import ConsultingView from '@/views/ConsultingView.vue'
import HomeView from '@/views/HomeView.vue'
import ServicesView from '@/views/ServicesView.vue'
import { createAppRouter } from '@/router'
import { useSiteStore } from '@/stores/site.store'

async function readyRouter(router: Router, path: string) {
  await router.push(path)
  await router.isReady()
  return router
}

describe('application routes', () => {
  it('creates the planned five routes with the supplied history', async () => {
    const history = createMemoryHistory()
    const router = createAppRouter(history)

    expect(router.options.history).toBe(history)
    expect(router.options.scrollBehavior?.({} as never, {} as never, null)).toEqual({ top: 0 })
    expect(router.getRoutes().map((route) => route.path)).toEqual(
      expect.arrayContaining(['/', '/services', '/consulting', '/about', '/login']),
    )

    await readyRouter(router, '/services')
    expect(router.currentRoute.value.matched.at(-1)?.components?.default).toBe(ServicesView)
  })

  it.each([
    ['/', HomeView],
    ['/services', ServicesView],
    ['/consulting', ConsultingView],
    ['/about', AboutView],
    ['/login', AuthView],
  ] as const)('maps %s to its view shell', async (path, view) => {
    const router = await readyRouter(createAppRouter(createMemoryHistory()), path)

    expect(router.currentRoute.value.matched.at(-1)?.components?.default).toBe(view)
  })
})

describe('Footer', () => {
  it('renders the contact email from site store and falls back when absent', async () => {
    const pinia = createPinia()
    const store = useSiteStore(pinia)
    const router = await readyRouter(createAppRouter(createMemoryHistory()), '/')
    store.basicInfo = { contactEmail: 'hello@example.com' } as typeof store.basicInfo

    const wrapper = mount(Footer, { global: { plugins: [router, pinia] } })
    expect(wrapper.text()).toContain('hello@example.com')

    store.basicInfo = null
    await nextTick()
    expect(wrapper.text()).toContain('business@example.com')
  })
})

describe('Navigation', () => {
  it('highlights only the exact current path', async () => {
    const router = await readyRouter(createAppRouter(createMemoryHistory()), '/services')
    const wrapper = mount(Navigation, { global: { plugins: [router, createPinia()] } })

    expect(wrapper.find('[data-nav-path="/services"]').classes()).toContain('text-gray-950')
    expect(wrapper.find('[data-nav-path="/"]').classes()).not.toContain('text-gray-950')

    await router.push('/consulting')
    await nextTick()

    expect(wrapper.find('[data-nav-path="/services"]').classes()).not.toContain('text-gray-950')
  })

  it('closes the mobile menu after selecting a navigation link', async () => {
    const router = await readyRouter(createAppRouter(createMemoryHistory()), '/')
    const wrapper = mount(Navigation, { global: { plugins: [router, createPinia()] } })

    await wrapper.find('[data-testid="mobile-menu-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="mobile-menu-toggle"]').attributes('aria-label')).toBe('关闭菜单')

    const servicesLink = wrapper.find('[data-testid="mobile-nav-link-services"]')
    expect(servicesLink.attributes('href')).toBe('/services')
    await servicesLink.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="mobile-menu-toggle"]').attributes('aria-label')).toBe('打开菜单')
  })

  it('closes the mobile menu when the route changes externally', async () => {
    const router = await readyRouter(createAppRouter(createMemoryHistory()), '/')
    const wrapper = mount(Navigation, { global: { plugins: [router, createPinia()] } })

    await wrapper.find('[data-testid="mobile-menu-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(true)

    await router.push('/about')
    await nextTick()

    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="mobile-menu-toggle"]').attributes('aria-label')).toBe('打开菜单')
  })
})
