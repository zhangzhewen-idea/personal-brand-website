<script setup lang="ts">
import { Download, ExternalLink, Gift, Play, Scissors, ShoppingCart, Video, Volume2 } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ContactQrModal from '@/components/common/ContactQrModal.vue'
import PlaceholderModal from '@/components/common/PlaceholderModal.vue'
import VideoPlayerModal from '@/components/common/VideoPlayerModal.vue'
import { getApiErrorMessage } from '@/api/http'
import { useSiteStore } from '@/stores/site'
import type { MaterialItem, VideoItem } from '@/types/models'
import { resolveMediaUrl } from '@/utils/media-url'

const store = useSiteStore()
const { basicInfo, materials, matrixAccounts, videos } = storeToRefs(store)
const modalTitle = ref('')
const loading = ref(true)
const errorMessage = ref('')
const modalOpen = computed(() => Boolean(modalTitle.value))
const selectedVideo = ref<VideoItem | null>(null)
const selectedMaterial = ref<MaterialItem | null>(null)
const materialIcons = { Scissors, Volume2, Video, Gift }
const formatCount = (count: number) => count >= 10_000 ? `${Math.floor(count / 10_000)}万+` : `${count}`
const openModal = (title: string) => { modalTitle.value = title }
const playVideo = (video: VideoItem) => { selectedVideo.value = video }
const openMaterial = (material: MaterialItem) => {
  if (material.isFree && material.netdiskUrl) { window.open(material.netdiskUrl, '_blank', 'noopener,noreferrer'); return }
  if (material.isFree) { openModal('免费素材暂不可下载'); return }
  selectedMaterial.value = material
}
const scrollToWorks = () => document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' })
const load = async () => {
  loading.value = true
  errorMessage.value = ''
  try { await store.loadHome() }
  catch (error) { errorMessage.value = getApiErrorMessage(error, '首页内容加载失败，请确认后端服务是否可用') }
  finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <div class="w-full">
    <section class="relative h-screen w-full overflow-hidden bg-black">
      <div class="absolute inset-0"><video v-if="basicInfo?.homeCoverVideo" :src="resolveMediaUrl(basicInfo.homeCoverVideo)" autoplay muted loop playsinline class="h-full w-full object-cover opacity-60" /><div v-else class="h-full w-full bg-gradient-to-br from-slate-900 via-blue-950 to-black" /><div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" /></div>
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-white">
        <div class="max-w-4xl space-y-6 text-center">
          <h1 class="mb-4 text-5xl font-bold md:text-7xl">用剪辑重构影像记忆</h1><p class="text-xl text-gray-300 md:text-2xl">让每一帧都充满情绪力量</p>
          <button class="mt-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-8 py-4 text-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/30" @click="scrollToWorks"><Play class="h-6 w-6 fill-current" />观看作品集</button>
          <div class="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-12"><div><div class="text-3xl font-bold md:text-4xl">{{ formatCount(basicInfo?.totalPlayCount ?? 0) }}</div><div class="mt-1 text-sm text-gray-400">全网播放量</div></div><div><div class="text-3xl font-bold md:text-4xl">{{ formatCount(basicInfo?.totalLikeCount ?? 0) }}</div><div class="mt-1 text-sm text-gray-400">全网点赞数</div></div><div><div class="text-3xl font-bold md:text-4xl">{{ formatCount(basicInfo?.totalFollowerCount ?? 0) }}</div><div class="mt-1 text-sm text-gray-400">全网粉丝数</div></div></div>
        </div>
      </div>
    </section>

    <div v-if="errorMessage" class="bg-red-50 px-4 py-4 text-center text-red-700">{{ errorMessage }} <button class="ml-2 underline" @click="load">重试</button></div>
    <section id="works" class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">猜你喜欢</h2><p class="text-gray-600">精选作品，感受剪辑的魅力</p></div><div v-if="loading" class="py-12 text-center text-gray-500">正在加载作品…</div><div v-else-if="!videos.length" class="py-12 text-center text-gray-500">暂无公开视频作品</div><div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <article v-for="video in videos" :key="video.id" class="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"><div class="relative aspect-video overflow-hidden bg-gray-900"><img v-if="video.videoCover" :src="resolveMediaUrl(video.videoCover)" :alt="video.videoTitle" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><div v-else class="h-full w-full bg-gradient-to-br from-gray-700 to-gray-950" /><div class="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/60"><button class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md" :aria-label="`播放 ${video.videoTitle}`" @click="playVideo(video)"><Play class="h-8 w-8 fill-current text-white" /></button></div><div v-if="video.platformName" class="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-sm text-white">{{ video.platformName }}</div></div><div class="p-6"><h3 class="mb-2 text-xl font-semibold">{{ video.videoTitle }}</h3><p class="mb-4 line-clamp-2 text-gray-600">{{ video.videoIntro }}</p><div class="flex items-center justify-between"><span class="text-sm text-gray-500">{{ video.playCountText ? `${video.playCountText} 播放` : '播放量暂未公布' }}</span><button class="flex items-center gap-1 text-sm text-blue-600" @click="playVideo(video)">观看完整视频<ExternalLink class="h-4 w-4" /></button></div></div></article>
    </div></div></section>

    <section class="bg-white px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">素材库</h2><p class="text-gray-600">优质素材资源，助力你的创作</p></div><div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <article v-for="material in materials" :key="material.id" class="rounded-xl bg-gray-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div :class="[material.colorClass, 'mb-4 flex h-12 w-12 items-center justify-center rounded-lg']"><component :is="materialIcons[material.iconName] || Gift" class="h-6 w-6 text-white" /></div><h3 class="mb-2 text-xl font-semibold">{{ material.materialTitle }}</h3><p class="mb-4 min-h-10 text-sm text-gray-600">{{ material.materialIntro }}</p><div class="mb-4 flex items-center justify-between"><span class="text-2xl font-bold text-blue-600">{{ material.isFree ? '免费' : `¥${material.price}` }}</span><span class="text-sm text-gray-500">{{ material.itemCount }}+ 素材</span></div><button class="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100" :class="material.isFree ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' : ''" @click="openMaterial(material)"><Download v-if="material.isFree" class="h-4 w-4" /><ShoppingCart v-else class="h-4 w-4" />{{ material.isFree ? '免费下载' : '立即购买' }}</button></article>
    </div></div></section>

    <section class="bg-gradient-to-b from-gray-50 to-white px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">关注我的更多平台</h2><p class="text-gray-600">全网同名，持续更新优质内容</p></div><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <a v-for="account in matrixAccounts" :key="account.id" :href="account.accountUrl || undefined" target="_blank" rel="noopener noreferrer" class="group rounded-xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"><div class="flex flex-col items-center text-center"><div :class="[account.colorClass, 'mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition group-hover:scale-110']"><img v-if="account.platformLogo" :src="resolveMediaUrl(account.platformLogo)" :alt="account.platformName" class="h-12 w-12 rounded-lg object-cover" /><Video v-else class="h-12 w-12 text-white" /></div><h3 class="mb-1 text-xl font-semibold">{{ account.platformName }}</h3><p class="mb-3 text-sm text-gray-600">{{ account.intro || '影像创作者' }}</p><div class="mb-4"><span class="text-2xl font-bold text-blue-600">{{ account.followerCountText || '--' }}</span><span class="ml-1 text-sm text-gray-500">粉丝</span></div><div class="flex items-center gap-1 text-sm text-blue-600">访问主页<ExternalLink class="h-4 w-4" /></div></div></a>
    </div></div></section>

    <PlaceholderModal :open="modalOpen" :title="modalTitle" @close="modalTitle = ''"><p class="text-gray-600">当前素材暂未配置下载地址，请稍后再试。</p></PlaceholderModal>
    <VideoPlayerModal :open="Boolean(selectedVideo)" :title="selectedVideo?.videoTitle || '播放视频'" :video-url="selectedVideo?.videoUrl || ''" @close="selectedVideo = null" />
    <ContactQrModal :open="Boolean(selectedMaterial)" :title="selectedMaterial ? `购买 ${selectedMaterial.materialTitle}` : '购买素材'" description="扫码联系询问价格并购买" :qr-code-url="basicInfo?.contactQrCode || null" @close="selectedMaterial = null" />
  </div>
</template>
