import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LoginPayload } from '@/models/auth'
import type { UserProfile } from '@/models/entities'
import { AppError } from '@/services/app-error'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<AppError | null>(null)
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const restoreSession = () => {
    const session = authService.restore()
    token.value = session?.token ?? null
    user.value = session?.user ?? null
    return session
  }

  const login = async (payload: LoginPayload) => {
    loading.value = true
    error.value = null
    try {
      const session = await authService.login(payload)
      token.value = session.token
      user.value = session.user
      return session
    } catch (cause) {
      token.value = null
      user.value = null
      error.value = cause instanceof AppError ? cause : new AppError('登录失败')
      throw cause
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    token.value = null
    user.value = null
    error.value = null
  }

  restoreSession()

  return { token, user, loading, error, isAuthenticated, login, restoreSession, logout }
})
