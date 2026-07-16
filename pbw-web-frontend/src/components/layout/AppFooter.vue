<script setup lang="ts">import { Video } from 'lucide-vue-next'</script>
<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div class="md:col-span-2"><div class="mb-4 flex items-center gap-2"><Video class="h-6 w-6 text-blue-500" /><span class="text-lg font-semibold text-white">影像创作者</span></div><p class="max-w-md text-sm text-gray-400">用剪辑重构影像记忆，让每帧都有情绪力量</p></div>
        <div><h3 class="mb-4 font-medium text-white">快速链接</h3><ul class="space-y-2 text-sm"><li><RouterLink to="/">作品展示</RouterLink></li><li><RouterLink to="/services">服务</RouterLink></li><li><RouterLink to="/consulting">商业咨询</RouterLink></li><li><RouterLink to="/about">关于我</RouterLink></li></ul></div>
        <div><h3 class="mb-4 font-medium text-white">联系方式</h3><ul class="space-y-2 text-sm"><li>商务合作</li><li class="text-blue-400">contact@example.com</li></ul></div>
      </div>
      <div class="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">© 2026 影像创作者. All rights reserved.</div>
    </div>
  </footer>
</template>
