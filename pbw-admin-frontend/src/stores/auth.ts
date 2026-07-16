import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/modules/auth'

const TOKEN_KEY = 'pbw-admin-token'
const USER_KEY = 'pbw-admin-user'

interface AdminUser {
  nickname: string
  role: '管理员'
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const savedUser = localStorage.getItem(USER_KEY)
  const user = ref<AdminUser | null>(savedUser ? JSON.parse(savedUser) : null)
  const isAuthenticated = computed(() => Boolean(token.value))

  const saveSession = (nextToken: string, nextUser: AdminUser) => {
    token.value = nextToken
    user.value = nextUser
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const login = async (account: string, password: string, testMode = true) => {
    if (testMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 450))
      if (account !== 'admin' || password !== '123456') {
        throw new Error('测试账号或密码不正确')
      }
      saveSession('pbw-test-token', { nickname: '管理员', role: '管理员' })
      return
    }

    const { data } = await authApi.login({ account, password })
    saveSession(data.token, { nickname: data.nickname, role: data.role })
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, user, isAuthenticated, login, logout }
})
