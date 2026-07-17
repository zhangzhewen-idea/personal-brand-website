import { defineStore } from 'pinia'
import { ref } from 'vue'
import { contentApi } from '@/api/content'
import { userApi, type LoginPayload, type RegisterPayload } from '@/api/user'
import { tokenStorage } from '@/auth/token-storage'
import type { BasicInfo, Course, MaterialItem, MatrixAccount, User, VideoItem } from '@/types/models'

export const useSiteStore = defineStore('site', () => {
  const currentUser = ref<User | null>(null)
  const basicInfo = ref<BasicInfo | null>(null)
  const videos = ref<VideoItem[]>([])
  const materials = ref<MaterialItem[]>([])
  const matrixAccounts = ref<MatrixAccount[]>([])
  const courses = ref<Course[]>([])
  const authInitialized = ref(false)
  const mobileMenuOpen = ref(false)
  let basicInfoPromise: Promise<void> | null = null
  let matrixAccountsPromise: Promise<void> | null = null
  let coursesPromise: Promise<void> | null = null

  const setMobileMenuOpen = (value: boolean) => { mobileMenuOpen.value = value }
  const loadBasicInfo = (): Promise<void> => {
    if (basicInfo.value) return Promise.resolve()
    return basicInfoPromise ??= contentApi.getBasicInfo()
      .then((data) => { basicInfo.value = data })
      .finally(() => { basicInfoPromise = null })
  }
  const loadMatrixAccounts = (): Promise<void> => {
    if (matrixAccounts.value.length) return Promise.resolve()
    return matrixAccountsPromise ??= contentApi.getMatrixAccounts()
      .then((data) => { matrixAccounts.value = data })
      .finally(() => { matrixAccountsPromise = null })
  }
  const loadCourses = (): Promise<void> => {
    if (courses.value.length) return Promise.resolve()
    return coursesPromise ??= contentApi.getCourses()
      .then((data) => { courses.value = data })
      .finally(() => { coursesPromise = null })
  }
  const loadHome = async () => {
    const [, loadedVideos, loadedMaterials] = await Promise.all([
      loadBasicInfo(),
      contentApi.getVideos(4),
      contentApi.getMaterials(4),
      loadMatrixAccounts(),
    ])
    videos.value = loadedVideos
    materials.value = loadedMaterials
  }
  const login = async (payload: LoginPayload, remember: boolean) => {
    const result = await userApi.login(payload)
    tokenStorage.set(result.token, remember)
    currentUser.value = result.user
  }
  const register = async (payload: RegisterPayload) => {
    const result = await userApi.register(payload)
    tokenStorage.set(result.token, true)
    currentUser.value = result.user
  }
  const restoreSession = async () => {
    if (!tokenStorage.get()) { authInitialized.value = true; return }
    try { currentUser.value = await userApi.current() }
    catch { tokenStorage.clear(); currentUser.value = null }
    finally { authInitialized.value = true }
  }
  const logout = async () => {
    try { if (tokenStorage.get()) await userApi.logout() }
    finally { tokenStorage.clear(); currentUser.value = null }
  }

  return {
    currentUser, basicInfo, videos, materials, matrixAccounts, courses, authInitialized, mobileMenuOpen,
    setMobileMenuOpen, loadBasicInfo, loadMatrixAccounts, loadCourses, loadHome, login, register, restoreSession, logout,
  }
})
