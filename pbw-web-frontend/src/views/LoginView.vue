<script setup lang="ts">
import { Eye, EyeOff, Lock, Mail, User, Video } from 'lucide-vue-next'
import { ref } from 'vue'

const activeTab = ref<'login' | 'register'>('login')
const showPassword = ref(false)
</script>

<template>
  <div class="flex min-h-screen">
    <section class="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-white lg:flex">
      <RouterLink to="/" class="flex items-center gap-2"><Video class="h-8 w-8" /><span class="text-2xl font-bold">影像创作者</span></RouterLink>
      <div class="space-y-6"><h1 class="text-5xl font-bold leading-tight">用剪辑重构<br />影像记忆</h1><p class="text-xl text-blue-100">加入我们，开启你的创作之旅</p><div class="grid grid-cols-3 gap-6 pt-8"><div><div class="text-3xl font-bold">1280万+</div><div class="text-sm text-blue-200">全网播放</div></div><div><div class="text-3xl font-bold">86万+</div><div class="text-sm text-blue-200">点赞收藏</div></div><div><div class="text-3xl font-bold">24万+</div><div class="text-sm text-blue-200">忠实粉丝</div></div></div></div>
      <div class="text-sm text-blue-200">© 2026 影像创作者. All rights reserved.</div>
    </section>
    <section class="flex flex-1 items-center justify-center bg-gray-50 p-8"><div class="w-full max-w-md"><div class="mb-8 flex items-center justify-center gap-2 lg:hidden"><Video class="h-8 w-8 text-blue-600" /><span class="text-2xl font-bold">影像创作者</span></div>
      <div class="mb-8 grid grid-cols-2 rounded-lg bg-gray-200 p-1"><button class="rounded-md py-2 text-sm font-medium" :class="activeTab === 'login' ? 'bg-white shadow-sm' : 'text-gray-600'" @click="activeTab = 'login'">登录</button><button class="rounded-md py-2 text-sm font-medium" :class="activeTab === 'register' ? 'bg-white shadow-sm' : 'text-gray-600'" @click="activeTab = 'register'">注册</button></div>
      <div class="rounded-2xl bg-white p-8 shadow-xl"><div class="mb-6"><h2 class="mb-2 text-2xl font-bold">{{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}</h2><p class="text-gray-600">{{ activeTab === 'login' ? '登录你的账号继续创作' : '加入我们，开启创作之旅' }}</p></div>
        <form class="space-y-4" @submit.prevent>
          <label v-if="activeTab === 'register'" class="block"><span class="font-medium">昵称</span><span class="relative mt-1 block"><User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input name="nickname" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="你的昵称" /></span></label>
          <label class="block"><span class="font-medium">账号</span><span class="relative mt-1 block"><User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input name="account" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入账号" /></span></label>
          <label v-if="activeTab === 'register'" class="block"><span class="font-medium">邮箱</span><span class="relative mt-1 block"><Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input name="email" type="email" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" /></span></label>
          <label class="block"><span class="font-medium">密码</span><span class="relative mt-1 block"><Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input name="password" :type="showPassword ? 'text' : 'password'" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" /><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="显示密码" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" class="h-5 w-5" /><Eye v-else class="h-5 w-5" /></button></span></label>
          <label v-if="activeTab === 'register'" class="block"><span class="font-medium">确认密码</span><span class="relative mt-1 block"><Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input name="confirmPassword" type="password" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="再次输入密码" /></span></label>
          <div v-if="activeTab === 'login'" class="flex items-center justify-between text-sm"><label class="flex items-center gap-2 text-gray-600"><input type="checkbox" />记住我</label><span class="text-blue-600">忘记密码?</span></div>
          <label v-else class="flex items-start gap-2 text-sm text-gray-600"><input type="checkbox" class="mt-1" />我同意服务条款和隐私政策</label>
          <button type="submit" disabled class="w-full rounded-md bg-gray-900 py-3 font-medium text-white">{{ activeTab === 'login' ? '登录' : '注册' }}</button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-600">{{ activeTab === 'login' ? '还没有账号?' : '已有账号?' }} <button class="font-medium text-blue-600" @click="activeTab = activeTab === 'login' ? 'register' : 'login'">{{ activeTab === 'login' ? '立即注册' : '立即登录' }}</button></div>
      </div>
      <div class="mt-8 text-center"><RouterLink to="/" class="text-sm text-gray-600">← 返回首页</RouterLink></div>
    </div></section>
  </div>
</template>
