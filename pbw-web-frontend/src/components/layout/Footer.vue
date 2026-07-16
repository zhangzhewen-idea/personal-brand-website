<template>
  <footer class="border-t border-gray-100 bg-gray-950 text-gray-300">
    <div class="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
      <div>
        <p class="text-lg font-bold text-white">影像创作</p>
        <p class="mt-3 text-sm leading-6">用影像记录灵感，用创作连接更多可能。</p>
      </div>
      <div>
        <p class="font-semibold text-white">快速链接</p>
        <div class="mt-3 flex flex-col gap-2 text-sm">
          <RouterLink to="/services">服务课程</RouterLink>
          <RouterLink to="/consulting">商业咨询</RouterLink>
          <RouterLink to="/about">关于我</RouterLink>
        </div>
      </div>
      <div>
        <p class="font-semibold text-white">联系我</p>
        <p class="mt-3 text-sm">{{ basicInfo?.contactEmail ?? 'business@example.com' }}</p>
      </div>
    </div>
    <div class="border-t border-white/10 px-6 py-4 text-center text-xs">© 2026 影像创作</div>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useSiteStore } from '@/stores/site.store'

const { basicInfo } = storeToRefs(useSiteStore())
</script>
