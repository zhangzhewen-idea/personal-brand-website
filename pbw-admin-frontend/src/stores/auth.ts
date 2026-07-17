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

  const login = async (account: string, password: string) => {
    const { data } = await authApi.login({ account, password })
    saveSession(data.token, { nickname: data.nickname, role: data.role })
  }

  const clearSession = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const logout = async () => {
    try {
      if (token.value) await authApi.logout()
    } finally {
      clearSession()
    }
  }

  return { token, user, isAuthenticated, login, logout, clearSession }
})
