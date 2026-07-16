import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'services', name: 'services', component: () => import('@/views/ServicesView.vue') },
        { path: 'consulting', name: 'consulting', component: () => import('@/views/ConsultingView.vue') },
        { path: 'about', name: 'about', component: () => import('@/views/AboutView.vue') },
      ],
    },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  ],
})

export default router
