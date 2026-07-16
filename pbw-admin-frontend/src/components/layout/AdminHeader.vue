<template>
  <header class="admin-header">
    <div class="header-left"><el-button class="mobile-menu-button" text @click="$emit('menu')"><el-icon><Menu /></el-icon></el-button><el-breadcrumb separator="/" aria-label="页面位置"><el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">{{ item.title }}</el-breadcrumb-item></el-breadcrumb></div>
    <div class="header-user"><span>管理员</span><el-button text @click="logout">退出登录</el-button></div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.store'
defineEmits<{ menu: [] }>()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const breadcrumbs = computed(() => route.matched.filter((record) => record.meta.title).map((record) => ({ path: record.path, title: String(record.meta.title) })))
const logout = async () => { authStore.logout(); await router.push('/login') }
</script>

<style scoped>
.admin-header { height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; border-bottom: 1px solid #e7ebf1; background: #fff; }
.header-left, .header-user { display: flex; align-items: center; gap: 16px; }.header-user { color: #59687b; font-size: 14px; }.mobile-menu-button { display: none; }
@media (max-width: 760px) { .admin-header { padding: 0 18px; }.mobile-menu-button { display: inline-flex; } }
</style>
