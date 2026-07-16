import type { Pinia } from 'pinia'
import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const lazy = (loader: () => Promise<unknown>) => loader

export function createAppRouter(pinia: Pinia, history: RouterHistory = createWebHistory()) {
  const router = createRouter({
    history,
    routes: [
      {
        path: '/login',
        name: 'login',
        component: lazy(() => import('@/views/auth/LoginView.vue')),
        meta: { title: '登录', guestOnly: true },
      },
      {
        path: '/',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
          { path: '', redirect: '/dashboard' },
          { path: 'dashboard', name: 'dashboard', component: lazy(() => import('@/views/DashboardView.vue')), meta: { title: '首页', requiresAuth: true } },
          { path: 'users', name: 'users', component: lazy(() => import('@/views/UserListView.vue')), meta: { title: '用户管理', requiresAuth: true } },
          { path: 'content/basic-info', name: 'basic-info', component: lazy(() => import('@/views/BasicInfoView.vue')), meta: { title: '基本信息', requiresAuth: true } },
          { path: 'content/videos', name: 'videos', component: lazy(() => import('@/views/VideoListView.vue')), meta: { title: '视频管理', requiresAuth: true } },
          { path: 'content/materials', name: 'materials', component: lazy(() => import('@/views/MaterialListView.vue')), meta: { title: '素材管理', requiresAuth: true } },
          { path: 'content/matrix-accounts', name: 'matrix-accounts', component: lazy(() => import('@/views/MatrixAccountListView.vue')), meta: { title: '矩阵账号', requiresAuth: true } },
          { path: 'content/courses', name: 'courses', component: lazy(() => import('@/views/CourseListView.vue')), meta: { title: '课程管理', requiresAuth: true } },
        ],
      },
      { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
    ],
  })

  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)
    if (to.meta.requiresAuth && !authStore.isAuthenticated) return { name: 'login' }
    if (to.meta.guestOnly && authStore.isAuthenticated) return { name: 'dashboard' }
    return true
  })

  return router
}

import pinia from '@/stores'
export const router = createAppRouter(pinia)
