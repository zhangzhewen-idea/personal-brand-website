import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ConsultingView from '@/views/ConsultingView.vue'
import AboutView from '@/views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({
    history,
    scrollBehavior: () => ({ top: 0 }),
    routes: [
      {
        path: '/',
        component: SiteLayout,
        children: [
          { path: '', component: HomeView },
          { path: 'services', component: ServicesView },
          { path: 'consulting', component: ConsultingView },
          { path: 'about', component: AboutView },
        ],
      },
      { path: '/login', component: AuthLayout, children: [{ path: '', component: AuthView }] },
    ],
  })
}

export default createAppRouter()
