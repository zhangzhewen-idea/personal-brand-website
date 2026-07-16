<script setup lang="ts">
import { ref } from 'vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import BrandPanel from '@/components/sections/auth/BrandPanel.vue'
import LoginForm from '@/components/sections/auth/LoginForm.vue'
import RegisterForm from '@/components/sections/auth/RegisterForm.vue'

const activeTab = ref('login')
const tabs = [
  { label: '登录', value: 'login' },
  { label: '注册', value: 'register' },
]
</script>

<template>
  <section data-testid="auth-view" class="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.9fr)]">
    <BrandPanel />
    <main class="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
      <div class="w-full max-w-md">
        <div class="mb-8 lg:hidden">
          <span class="text-lg font-semibold text-slate-950">影像创作者</span>
        </div>
        <div class="mb-8">
          <h2 class="text-3xl font-semibold text-gray-950">{{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}</h2>
          <p class="mt-2 text-gray-500">{{ activeTab === 'login' ? '登录后继续你的创作旅程' : '注册账号，开启你的创作旅程' }}</p>
        </div>
        <BaseTabs v-model="activeTab" :tabs="tabs">
          <template #default="{ active }">
            <div class="mt-8">
              <LoginForm v-if="active === 'login'" />
              <RegisterForm v-else />
            </div>
          </template>
        </BaseTabs>
      </div>
    </main>
  </section>
</template>
