import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/models'

export const useSiteStore = defineStore('site', () => {
  const currentUser = ref<User | null>(null)
  const mobileMenuOpen = ref(false)
  const setMobileMenuOpen = (value: boolean) => { mobileMenuOpen.value = value }
  return { currentUser, mobileMenuOpen, setMobileMenuOpen }
})
