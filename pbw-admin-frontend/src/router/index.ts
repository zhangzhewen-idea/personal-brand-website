import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '管理员登录', public: true },
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: '工作台' },
        },
        {
          path: 'basic-info',
          name: 'basic-info',
          component: () => import('@/views/management/BasicInfoView.vue'),
          meta: { title: '基本信息管理' },
        },
        {
          path: 'videos',
          name: 'videos',
          component: () => import('@/views/management/VideoManagementView.vue'),
          meta: { title: '视频管理' },
        },
        {
          path: 'materials',
          name: 'materials',
          component: () => import('@/views/management/MaterialManagementView.vue'),
          meta: { title: '素材库管理' },
        },
        {
          path: 'matrix-accounts',
          name: 'matrix-accounts',
          component: () => import('@/views/management/MatrixAccountView.vue'),
          meta: { title: '矩阵账号管理' },
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('@/views/management/CourseManagementView.vue'),
          meta: { title: '课程管理' },
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/management/UserManagementView.vue'),
          meta: { title: '用户管理' },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  document.title = `${String(to.meta.title || '管理后台')} - PBW`

  if (!to.meta.public && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
