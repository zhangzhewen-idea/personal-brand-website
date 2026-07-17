<script setup lang="ts">
import { LogOut, Menu, Video, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/site'

const links = [
  { name: 'home', label: '作品展示' },
  { name: 'services', label: '服务' },
  { name: 'consulting', label: '商业咨询' },
  { name: 'about', label: '关于我' },
]
const store = useSiteStore()
const { currentUser, mobileMenuOpen } = storeToRefs(store)
const handleLogout = async () => { await store.logout() }
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Video class="h-8 w-8 text-blue-600" /><span class="text-xl font-semibold">影像创作者</span>
        </RouterLink>
        <div class="hidden items-center gap-8 md:flex">
          <RouterLink v-for="link in links" :key="link.name" :to="{ name: link.name }" class="text-sm text-gray-700 transition-colors hover:text-blue-600" exact-active-class="!font-medium !text-blue-600">{{ link.label }}</RouterLink>
        </div>
        <div v-if="currentUser" class="hidden items-center gap-3 md:flex"><span class="text-sm text-gray-700">{{ currentUser.nickname }}</span><button class="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="handleLogout"><LogOut class="h-4 w-4" />退出</button></div>
        <RouterLink v-else :to="{ name: 'login' }" class="hidden rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 md:block">登录</RouterLink>
        <button class="p-2 md:hidden" aria-label="打开菜单" @click="store.setMobileMenuOpen(!mobileMenuOpen)">
          <X v-if="mobileMenuOpen" class="h-6 w-6" /><Menu v-else class="h-6 w-6" />
        </button>
      </div>
    </div>
    <div v-if="mobileMenuOpen" class="border-t border-gray-200 bg-white md:hidden">
      <div class="space-y-3 px-4 py-4">
        <RouterLink v-for="link in links" :key="link.name" :to="{ name: link.name }" class="block py-2 text-sm text-gray-700" exact-active-class="!font-medium !text-blue-600" @click="store.setMobileMenuOpen(false)">{{ link.label }}</RouterLink>
        <button v-if="currentUser" class="block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-sm" @click="handleLogout(); store.setMobileMenuOpen(false)">退出 {{ currentUser.nickname }}</button>
        <RouterLink v-else :to="{ name: 'login' }" class="block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-sm" @click="store.setMobileMenuOpen(false)">登录</RouterLink>
      </div>
    </div>
  </nav>
</template>
