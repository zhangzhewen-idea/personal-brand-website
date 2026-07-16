<template>
  <aside data-testid="admin-sidebar" class="admin-sidebar" :class="{ 'is-collapsed': collapsed }">
    <div class="sidebar-brand"><span class="brand-mark">PBW</span><span v-if="!collapsed">后台管理</span></div>
    <el-menu :default-active="route.path" :collapse="collapsed" router class="sidebar-menu">
      <el-menu-item index="/dashboard"><el-icon><House /></el-icon><template #title>首页</template></el-menu-item>
      <el-menu-item index="/users"><el-icon><User /></el-icon><template #title>用户管理</template></el-menu-item>
      <el-sub-menu index="content"><template #title><el-icon><Files /></el-icon><span>内容管理</span></template>
        <el-menu-item index="/content/basic-info">基本信息</el-menu-item>
        <el-menu-item index="/content/videos">视频管理</el-menu-item>
        <el-menu-item index="/content/materials">素材管理</el-menu-item>
        <el-menu-item index="/content/matrix-accounts">矩阵账号</el-menu-item>
        <el-menu-item index="/content/courses">课程管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <button data-testid="sidebar-collapse" class="collapse-button" type="button" @click="$emit('toggle')">{{ collapsed ? '›' : '‹' }}</button>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Files, House, User } from '@element-plus/icons-vue'
defineProps<{ collapsed: boolean }>()
defineEmits<{ toggle: [] }>()
const route = useRoute()
</script>

<style scoped>
.admin-sidebar { position: relative; display: flex; flex-direction: column; width: 232px; min-height: 100vh; flex-shrink: 0; color: #d9e3f0; background: #17263b; transition: width .2s ease; }
.admin-sidebar.is-collapsed { width: 64px; }
.sidebar-brand { height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 20px; font-weight: 600; white-space: nowrap; }
.brand-mark { display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid #91a8c1; font-size: 9px; letter-spacing: .08em; }
.sidebar-menu { border-right: 0; background: transparent; }
.sidebar-menu :deep(.el-menu-item), .sidebar-menu :deep(.el-sub-menu__title) { color: #b4c2d3; }
.sidebar-menu :deep(.el-menu-item.is-active) { color: #fff; background: #2b4768; }
.sidebar-menu :deep(.el-menu-item:hover), .sidebar-menu :deep(.el-sub-menu__title:hover) { background: #223b59; }
.collapse-button { position: absolute; right: -12px; bottom: 28px; z-index: 2; width: 24px; height: 24px; border: 1px solid #dce4ee; border-radius: 50%; color: #526e91; background: #fff; cursor: pointer; }
@media (max-width: 760px) { .admin-sidebar { display: none; } }
</style>
