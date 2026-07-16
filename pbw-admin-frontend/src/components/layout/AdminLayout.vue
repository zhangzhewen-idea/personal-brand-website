<template>
  <div class="admin-layout">
    <AdminSidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />
    <el-drawer v-model="mobileMenuOpen" direction="ltr" size="232px" :with-header="false" class="mobile-drawer">
      <AdminSidebar :collapsed="false" @toggle="mobileMenuOpen = false" />
    </el-drawer>
    <div class="admin-main"><AdminHeader @menu="mobileMenuOpen = true" /><main data-testid="admin-layout-content" class="admin-content"><RouterView /></main></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminHeader from './AdminHeader.vue'
import AdminSidebar from './AdminSidebar.vue'
const collapsed = ref(false)
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.admin-layout { min-height: 100vh; display: flex; background: var(--pbw-page); }.admin-main { min-width: 0; flex: 1; }.admin-content { padding: 32px; }
@media (max-width: 760px) { .admin-content { padding: 20px 16px; } }
</style>
