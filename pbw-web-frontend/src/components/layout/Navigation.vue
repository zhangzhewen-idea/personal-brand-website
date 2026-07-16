<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const links = [
  { label: '首页', path: '/' },
  { label: '服务课程', path: '/services' },
  { label: '商业咨询', path: '/consulting' },
  { label: '关于我', path: '/about' },
]

function isActive(path: string) {
  return route.path === path
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

watch(() => route.path, closeMobileMenu)
</script>

<template>
  <header class="border-b border-gray-100 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <RouterLink to="/" class="text-xl font-bold tracking-tight text-gray-950" @click="closeMobileMenu">
        影像创作
      </RouterLink>

      <nav class="hidden items-center gap-8 md:flex" aria-label="主导航">
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          :data-nav-path="link.path"
          class="text-sm transition-colors"
          :class="isActive(link.path) ? 'font-semibold text-gray-950' : 'text-gray-500 hover:text-gray-950'"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/login" class="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white">
          登录 / 注册
        </RouterLink>
      </nav>

      <button
        data-testid="mobile-menu-toggle"
        type="button"
        class="rounded-lg p-2 text-gray-950 md:hidden"
        :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
        :aria-expanded="isMobileMenuOpen"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span aria-hidden="true">☰</span>
      </button>
    </div>

    <nav v-if="isMobileMenuOpen" data-testid="mobile-menu" class="border-t border-gray-100 px-6 py-4 md:hidden" aria-label="移动端主导航">
      <div class="flex flex-col gap-3">
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          :data-testid="`mobile-nav-link-${link.path.slice(1) || 'home'}`"
          class="rounded-lg px-3 py-2 text-sm"
          :class="isActive(link.path) ? 'bg-gray-100 font-semibold text-gray-950' : 'text-gray-600'"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/login" class="rounded-lg bg-gray-950 px-3 py-2 text-center text-sm font-medium text-white" @click="closeMobileMenu">
          登录 / 注册
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
