<script setup lang="ts">
import { Download, ExternalLink, Gift, Play, Scissors, ShoppingCart, Video, Volume2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import PlaceholderModal from '@/components/common/PlaceholderModal.vue'
import { basicInfo, materials, matrixAccounts, videos } from '@/mock/site-data'

const modalTitle = ref('')
const modalOpen = computed(() => Boolean(modalTitle.value))
const materialIcons = { Scissors, Volume2, Video, Gift }
const formatCount = (count: number) => count >= 10_000 ? `${Math.floor(count / 10_000)}万+` : `${count}`
const openModal = (title: string) => { modalTitle.value = title }
</script>

<template>
  <div class="w-full">
    <section class="relative h-screen w-full overflow-hidden bg-black">
      <div class="absolute inset-0"><img src="https://images.unsplash.com/photo-1575320854760-bfffc3550640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920" alt="视频剪辑工作台" class="h-full w-full object-cover opacity-60" /><div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" /></div>
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-white">
        <div class="max-w-4xl space-y-6 text-center">
          <h1 class="mb-4 text-5xl font-bold md:text-7xl">用剪辑重构影像记忆</h1><p class="text-xl text-gray-300 md:text-2xl">让每一帧都充满情绪力量</p>
          <button class="mt-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-8 py-4 text-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/30"><Play class="h-6 w-6 fill-current" />观看作品集</button>
          <div class="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-12"><div><div class="text-3xl font-bold md:text-4xl">{{ formatCount(basicInfo.totalPlayCount) }}</div><div class="mt-1 text-sm text-gray-400">全网播放量</div></div><div><div class="text-3xl font-bold md:text-4xl">{{ formatCount(basicInfo.totalLikeCount) }}</div><div class="mt-1 text-sm text-gray-400">全网点赞数</div></div><div><div class="text-3xl font-bold md:text-4xl">{{ formatCount(basicInfo.totalFollowerCount) }}</div><div class="mt-1 text-sm text-gray-400">全网粉丝数</div></div></div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">猜你喜欢</h2><p class="text-gray-600">精选作品，感受剪辑的魅力</p></div><div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <article v-for="video in videos" :key="video.id" class="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"><div class="relative aspect-video overflow-hidden bg-gray-900"><img :src="video.videoCover || ''" :alt="video.videoTitle" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><div class="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/60"><button class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"><Play class="h-8 w-8 fill-current text-white" /></button></div><div class="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-sm text-white">{{ video.platformName }}</div></div><div class="p-6"><h3 class="mb-2 text-xl font-semibold">{{ video.videoTitle }}</h3><p class="mb-4 line-clamp-2 text-gray-600">{{ video.videoIntro }}</p><div class="flex items-center justify-between"><span class="text-sm text-gray-500">{{ video.playCountText }} 播放</span><button class="flex items-center gap-1 text-sm text-blue-600">观看完整视频<ExternalLink class="h-4 w-4" /></button></div></div></article>
    </div></div></section>

    <section class="bg-white px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">素材库</h2><p class="text-gray-600">优质素材资源，助力你的创作</p></div><div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <article v-for="material in materials" :key="material.id" class="rounded-xl bg-gray-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div :class="[material.colorClass, 'mb-4 flex h-12 w-12 items-center justify-center rounded-lg']"><component :is="materialIcons[material.iconName as keyof typeof materialIcons]" class="h-6 w-6 text-white" /></div><h3 class="mb-2 text-xl font-semibold">{{ material.materialTitle }}</h3><p class="mb-4 min-h-10 text-sm text-gray-600">{{ material.materialIntro }}</p><div class="mb-4 flex items-center justify-between"><span class="text-2xl font-bold text-blue-600">{{ material.isFree ? '免费' : `¥${material.price}` }}</span><span class="text-sm text-gray-500">{{ material.itemCount }}+ 素材</span></div><button class="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100" :class="material.isFree ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' : ''" @click="openModal(material.isFree ? '获取免费素材' : `购买 ${material.materialTitle}`)"><Download v-if="material.isFree" class="h-4 w-4" /><ShoppingCart v-else class="h-4 w-4" />{{ material.isFree ? '免费下载' : '立即购买' }}</button></article>
    </div></div></section>

    <section class="bg-gradient-to-b from-gray-50 to-white px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">关注我的更多平台</h2><p class="text-gray-600">全网同名，持续更新优质内容</p></div><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <a v-for="account in matrixAccounts" :key="account.id" :href="account.accountUrl || '#'" class="group rounded-xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"><div class="flex flex-col items-center text-center"><div :class="[account.colorClass, 'mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition group-hover:scale-110']"><img :src="account.platformLogo || ''" :alt="account.platformName" class="h-12 w-12 rounded-lg object-cover" /></div><h3 class="mb-1 text-xl font-semibold">{{ account.platformName }}</h3><p class="mb-3 text-sm text-gray-600">影像创作者</p><div class="mb-4"><span class="text-2xl font-bold text-blue-600">{{ account.followerCountText }}</span><span class="ml-1 text-sm text-gray-500">粉丝</span></div><div class="flex items-center gap-1 text-sm text-blue-600">访问主页<ExternalLink class="h-4 w-4" /></div></div></a>
    </div></div></section>

    <PlaceholderModal :open="modalOpen" :title="modalTitle" @close="modalTitle = ''"><p class="mb-4 text-gray-600">页面展示阶段暂不接入购买和下载功能。</p><div class="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-gray-200 text-center text-sm text-gray-500">二维码占位<br />后续接入真实数据</div></PlaceholderModal>
  </div>
</template>
