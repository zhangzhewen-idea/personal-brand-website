<script setup lang="ts">
import { Award, Camera, MessageCircle, Sparkles, Video } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ContactQrModal from '@/components/common/ContactQrModal.vue'
import { getApiErrorMessage } from '@/api/http'
import { useSiteStore } from '@/stores/site'

const services = [
  { id: 1, serviceTitle: '宣传片剪辑', serviceIntro: '企业形象片、品牌宣传片专业剪辑制作', priceText: '¥2000起', durationText: '3-5个工作日', colorClass: 'bg-blue-500', icon: Video, features: ['专业剪辑团队', '快速交付', '不限修改次数', '提供源文件'] },
  { id: 2, serviceTitle: '产品短视频', serviceIntro: '电商产品展示视频、种草视频，提升转化率', priceText: '¥800起', durationText: '2-3个工作日', colorClass: 'bg-purple-500', icon: Sparkles, features: ['创意策划', '精美包装', '适配多平台', '提升转化'] },
  { id: 3, serviceTitle: '活动记录快剪', serviceIntro: '会议、活动现场快速剪辑，当天交付精彩瞬间', priceText: '¥1500起', durationText: '1-2个工作日', colorClass: 'bg-green-500', icon: Camera, features: ['快速响应', '当天交付', '多机位剪辑', '精彩集锦'] },
  { id: 4, serviceTitle: '年会视频制作', serviceIntro: '年会开场视频、年度回顾视频，打造震撼效果', priceText: '¥3000起', durationText: '5-7个工作日', colorClass: 'bg-orange-500', icon: Award, features: ['创意策划', '特效制作', '配音配乐', '现场播放支持'] },
]
const workflow = [{ step: 1, title: '联系咨询', description: '扫码添加微信，说明需求' }, { step: 2, title: '需求沟通', description: '详细了解项目需求与预算' }, { step: 3, title: '方案确认', description: '提供方案与报价，确认合作' }, { step: 4, title: '制作交付', description: '按时交付成品，支持修改' }]
const store = useSiteStore()
const { basicInfo } = storeToRefs(store)
const consultModalOpen = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try { await store.loadBasicInfo() }
  catch (error) { errorMessage.value = getApiErrorMessage(error, '联系信息加载失败') }
})
</script>

<template><div class="min-h-screen bg-gradient-to-b from-gray-50 to-white"><div v-if="errorMessage" class="bg-red-50 px-4 py-4 text-center text-red-700">{{ errorMessage }}</div><section class="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-20 text-white"><div class="mx-auto max-w-7xl text-center"><h1 class="mb-6 text-5xl font-bold">商业剪辑服务</h1><p class="mx-auto mb-8 max-w-2xl text-xl text-purple-100">专业的剪辑团队，为您的品牌和活动提供高质量视频制作服务</p><button class="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-lg font-medium text-gray-900" @click="consultModalOpen = true"><MessageCircle class="h-5 w-5" />立即咨询</button></div></section>
<section class="px-4 py-20"><div class="mx-auto max-w-7xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">服务项目</h2><p class="text-gray-600">多样化的视频制作服务，满足您的不同需求</p></div><div class="grid grid-cols-1 gap-8 md:grid-cols-2"><article v-for="service in services" :key="service.id" class="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-xl"><div :class="[service.colorClass, 'p-6 text-white']"><div class="mb-3 flex items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20"><component :is="service.icon" class="h-6 w-6" /></div><h3 class="text-2xl font-bold">{{ service.serviceTitle }}</h3></div><p class="text-white/90">{{ service.serviceIntro }}</p></div><div class="p-6"><h4 class="mb-3 font-semibold">服务特色</h4><div class="mb-6 grid grid-cols-2 gap-2"><div v-for="feature in service.features" :key="feature" class="flex gap-2 text-sm text-gray-600"><span class="text-green-500">✓</span>{{ feature }}</div></div><div class="flex items-center justify-between border-t pt-4"><div><div class="text-2xl font-bold text-blue-600">{{ service.priceText }}</div><div class="text-sm text-gray-500">{{ service.durationText }}</div></div><button class="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800" @click="consultModalOpen = true">咨询服务</button></div></div></article></div></div></section>
<section class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-5xl"><div class="mb-12 text-center"><h2 class="mb-4 text-4xl font-bold">合作流程</h2><p class="text-gray-600">简单四步，开启合作之旅</p></div><div class="grid grid-cols-1 gap-6 md:grid-cols-4"><div v-for="item in workflow" :key="item.step" class="rounded-xl bg-white p-6 text-center shadow-md"><div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">{{ item.step }}</div><h3 class="mb-2 font-semibold">{{ item.title }}</h3><p class="text-sm text-gray-600">{{ item.description }}</p></div></div></div></section>
<ContactQrModal :open="consultModalOpen" title="联系咨询" description="扫描二维码联系我们，说明您的需求" :qr-code-url="basicInfo?.contactQrCode || null" @close="consultModalOpen = false" /></div></template>
