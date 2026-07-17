<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowDown,
  Bell,
  Collection,
  DataAnalysis,
  Expand,
  Files,
  Fold,
  House,
  Menu as MenuIcon,
  Monitor,
  Reading,
  Search,
  Share,
  User,
  VideoCamera,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const collapsed = ref(false)
const searchVisible = ref(false)
const searchKeyword = ref('')
const searchInputRef = ref<{ focus: () => void }>()
const appEnvironment = import.meta.env.VITE_APP_ENV
const backendPort = import.meta.env.VITE_BACKEND_PORT

const currentTitle = computed(() => String(route.meta.title || '工作台'))

const menuItems = [
  { index: '/', label: '工作台', icon: DataAnalysis },
  { index: '/basic-info', label: '基本信息', icon: Monitor },
  { index: '/videos', label: '视频管理', icon: VideoCamera },
  { index: '/materials', label: '素材库', icon: Files },
  { index: '/matrix-accounts', label: '矩阵账号', icon: Share },
  { index: '/courses', label: '课程管理', icon: Reading },
  { index: '/users', label: '用户管理', icon: User },
]

const filteredMenuItems = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  return keyword
    ? menuItems.filter((item) => item.label.toLowerCase().includes(keyword))
    : menuItems
})

const openGlobalSearch = () => {
  searchKeyword.value = ''
  searchVisible.value = true
  void nextTick(() => searchInputRef.value?.focus())
}

const navigateTo = async (path?: string) => {
  if (!path) return
  searchVisible.value = false
  await router.push(path)
}

const handleGlobalShortcut = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openGlobalSearch()
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', handleGlobalShortcut))

const handleUserCommand = async (command: string) => {
  if (command === 'logout') {
    await authStore.logout()
    router.replace('/login')
  }
}
</script>

<template>
  <div class="admin-shell" :class="{ 'is-collapsed': collapsed }">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand__mark"><Collection /></div>
        <div class="brand__text">
          <strong>PBW STUDIO</strong>
          <span>CONTENT ADMIN</span>
        </div>
      </div>

      <div class="sidebar__section-label">工作空间</div>
      <el-menu
        router
        :default-active="route.path"
        :collapse="collapsed"
        :collapse-transition="false"
        class="sidebar-menu"
      >
        <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.label }}</template>
        </el-menu-item>
      </el-menu>

      <div class="sidebar__footer">
        <div class="system-state">
          <span class="system-state__dot"></span>
          <div>
            <strong>{{ appEnvironment === 'prod' ? '生产环境' : '开发环境' }}</strong>
            <span>后端服务 :{{ backendPort }}</span>
          </div>
        </div>
      </div>
    </aside>

    <section class="main-shell">
      <header class="topbar">
        <div class="topbar__left">
          <button class="collapse-button" type="button" @click="collapsed = !collapsed">
            <el-icon><component :is="collapsed ? Expand : Fold" /></el-icon>
          </button>
          <div class="breadcrumb">
            <el-icon><House /></el-icon>
            <span>管理后台</span>
            <span class="breadcrumb__slash">/</span>
            <strong>{{ currentTitle }}</strong>
          </div>
        </div>

        <div class="topbar__right">
          <button class="topbar-search" type="button" @click="openGlobalSearch">
            <el-icon><Search /></el-icon>
            <span>搜索功能或页面</span>
            <kbd>⌘ K</kbd>
          </button>
          <button class="icon-button" type="button" aria-label="通知">
            <el-icon><Bell /></el-icon>
            <span class="notification-dot"></span>
          </button>
          <span class="topbar-divider"></span>
          <el-dropdown trigger="click" @command="handleUserCommand">
            <button class="user-menu" type="button">
              <span class="user-avatar">管</span>
              <span class="user-copy">
                <strong>{{ authStore.user?.nickname || '管理员' }}</strong>
                <small>超级管理员</small>
              </span>
              <el-icon><ArrowDown /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>个人资料</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="workspace">
        <RouterView />
      </main>
    </section>

    <el-dialog
      v-model="searchVisible"
      class="global-search-dialog"
      title="快速导航"
      width="460px"
      append-to-body
    >
      <el-input
        ref="searchInputRef"
        v-model="searchKeyword"
        :prefix-icon="Search"
        size="large"
        placeholder="搜索功能或页面"
        aria-label="搜索功能或页面"
        @keyup.enter="navigateTo(filteredMenuItems[0]?.index)"
      />
      <div class="global-search-results">
        <button
          v-for="item in filteredMenuItems"
          :key="item.index"
          type="button"
          @click="navigateTo(item.index)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
          <small>打开</small>
        </button>
        <p v-if="!filteredMenuItems.length">没有匹配的页面</p>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-shell {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 16%, rgba(37, 99, 235, 0.3), transparent 30%),
    radial-gradient(circle at 86% 10%, rgba(124, 58, 237, 0.28), transparent 28%),
    radial-gradient(circle at 60% 88%, rgba(67, 56, 202, 0.26), transparent 36%),
    #0f0c29;
  background-attachment: fixed;
}

.sidebar {
  position: fixed;
  z-index: 20;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 232px;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 14px;
  border-right: 1px solid rgba(143, 126, 211, 0.12);
  background: rgba(9, 8, 28, 0.88);
  backdrop-filter: blur(18px);
  transition: width 0.2s ease;
}

.brand {
  display: flex;
  height: 78px;
  align-items: center;
  gap: 11px;
  padding: 0 8px;
}

.brand__mark {
  display: grid;
  width: 36px;
  height: 36px;
  flex: none;
  place-items: center;
  border-radius: 10px;
  background: var(--pbw-blue);
  color: white;
  box-shadow: 0 7px 22px rgba(52, 111, 255, 0.3);
}

.brand__mark :deep(svg) {
  width: 18px;
}

.brand__text {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  white-space: nowrap;
}

.brand__text strong {
  color: #f8fafc;
  font-size: 13px;
  letter-spacing: 0.05em;
}

.brand__text span {
  margin-top: 3px;
  color: #64748b;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.sidebar__section-label {
  margin: 18px 12px 9px;
  color: #506078;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  white-space: nowrap;
}

.sidebar-menu {
  border: 0;
  background: transparent;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 204px;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 46px;
  margin: 3px 0;
  border-radius: 9px;
  color: #94a3b8;
  font-size: 13px;
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  font-size: 17px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(75, 73, 140, 0.24);
  color: #dce6f5;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(52, 111, 255, 0.28), rgba(124, 58, 237, 0.2));
  color: #9cb7ff;
  font-weight: 650;
}

.sidebar__footer {
  margin-top: auto;
  padding: 18px 5px 22px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.system-state {
  display: flex;
  overflow: hidden;
  align-items: center;
  gap: 10px;
  padding: 7px;
  white-space: nowrap;
}

.system-state__dot {
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.1);
}

.system-state div {
  display: flex;
  flex-direction: column;
}

.system-state strong {
  color: #cbd5e1;
  font-size: 11px;
}

.system-state span:last-child {
  margin-top: 2px;
  color: #64748b;
  font-size: 10px;
}

.main-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  margin-left: 232px;
  transition: margin-left 0.2s ease;
}

.topbar {
  position: sticky;
  z-index: 15;
  top: 0;
  display: flex;
  height: 68px;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 28px;
  border-bottom: 1px solid rgba(153, 139, 211, 0.14);
  background: rgba(15, 12, 41, 0.74);
  backdrop-filter: blur(18px);
}

.topbar__left,
.topbar__right,
.breadcrumb,
.user-menu {
  display: flex;
  align-items: center;
}

.collapse-button,
.icon-button,
.user-menu,
.topbar-search {
  border: 0;
  background: none;
  cursor: pointer;
}

.collapse-button {
  display: grid;
  width: 34px;
  height: 34px;
  margin-right: 14px;
  place-items: center;
  border-radius: 8px;
  color: #aaa6c4;
  font-size: 18px;
}

.collapse-button:hover,
.icon-button:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f8f7ff;
}

.breadcrumb {
  gap: 8px;
  color: #8f8aa9;
  font-size: 12px;
}

.breadcrumb strong {
  color: #e8e6f4;
  font-weight: 650;
}

.breadcrumb__slash {
  color: #5c5876;
}

.topbar__right {
  gap: 10px;
}

.topbar-search {
  display: flex;
  width: 222px;
  height: 36px;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid rgba(174, 165, 210, 0.18);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.045);
  color: #918da9;
  text-align: left;
}

.topbar-search span {
  flex: 1;
  font-size: 12px;
}

.topbar-search kbd {
  padding: 2px 5px;
  border: 1px solid rgba(174, 165, 210, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #aaa6c4;
  font: inherit;
  font-size: 10px;
}

.icon-button {
  position: relative;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 9px;
  color: #aaa6c4;
  font-size: 17px;
}

.notification-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 5px;
  height: 5px;
  border: 2px solid #0f0c29;
  border-radius: 50%;
  background: #ef4444;
}

.topbar-divider {
  width: 1px;
  height: 24px;
  margin: 0 4px;
  background: rgba(174, 165, 210, 0.16);
}

.user-menu {
  gap: 9px;
  padding: 4px;
  color: #eceaf6;
}

.user-avatar {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 9px;
  background: linear-gradient(145deg, rgba(52, 111, 255, 0.34), rgba(124, 58, 237, 0.28));
  color: #dce6ff;
  font-size: 13px;
  font-weight: 750;
}

.user-copy {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.user-copy strong {
  font-size: 12px;
  font-weight: 650;
}

.user-copy small {
  margin-top: 2px;
  color: #85809e;
  font-size: 10px;
}

.workspace {
  min-height: calc(100vh - 68px);
  box-sizing: border-box;
  padding: 28px;
}

.global-search-results {
  display: grid;
  gap: 6px;
  margin-top: 14px;
}

.global-search-results button {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid #e7ebf1;
  border-radius: 9px;
  background: #fff;
  color: #344054;
  cursor: pointer;
  text-align: left;
}

.global-search-results button:hover {
  border-color: #b9cdfd;
  background: #f5f8ff;
  color: var(--pbw-blue);
}

.global-search-results button span { flex: 1; }
.global-search-results button small { color: #98a2b3; }
.global-search-results > p { margin: 18px 0 4px; color: #98a2b3; text-align: center; }

.is-collapsed .sidebar {
  width: 78px;
}

.is-collapsed .main-shell {
  margin-left: 78px;
}

.is-collapsed .brand__text,
.is-collapsed .sidebar__section-label,
.is-collapsed .system-state div {
  display: none;
}

.is-collapsed .brand {
  justify-content: center;
  padding: 0;
}

.is-collapsed .sidebar-menu {
  width: 50px;
}

.is-collapsed .sidebar__footer {
  display: flex;
  justify-content: center;
}

@media (max-width: 960px) {
  .topbar-search {
    display: none;
  }
}

@media (max-width: 720px) {
  .sidebar {
    width: 78px;
  }

  .main-shell {
    margin-left: 78px;
  }

  .brand__text,
  .sidebar__section-label,
  .system-state div,
  .user-copy,
  .user-menu > .el-icon {
    display: none;
  }

  .brand {
    justify-content: center;
    padding: 0;
  }

  .sidebar-menu {
    width: 50px !important;
  }

  .sidebar-menu :deep(.el-menu-item span) {
    display: none;
  }

  .workspace,
  .topbar {
    padding-right: 18px;
    padding-left: 18px;
  }

  .breadcrumb > span:not(.breadcrumb__slash),
  .breadcrumb > .el-icon,
  .topbar-divider {
    display: none;
  }
}
</style>
