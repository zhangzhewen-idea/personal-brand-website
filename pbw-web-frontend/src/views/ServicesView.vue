<script setup lang="ts">
import { Clock, GraduationCap, Palette, TrendingUp, Video } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ContactQrModal from '@/components/common/ContactQrModal.vue'
import { getApiErrorMessage } from '@/api/http'
import { useSiteStore } from '@/stores/site'
import type { Course } from '@/types/models'

const store = useSiteStore()
const { basicInfo, courses } = storeToRefs(store)
const loading = ref(true)
const errorMessage = ref('')
const selectedCourse = ref<Course | null>(null)
const icons = { Video, GraduationCap, Palette, TrendingUp }
onMounted(async () => {
  try { await Promise.all([store.loadCourses(), store.loadBasicInfo()]) }
  catch (error) { errorMessage.value = getApiErrorMessage(error, '课程内容加载失败') }
  finally { loading.value = false }
})
</script>
<template><div class="min-h-screen bg-gradient-to-b from-gray-50 to-white"><section class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-20 text-white"><div class="mx-auto max-w-7xl text-center"><h1 class="mb-6 text-5xl font-bold">课程体系</h1><p class="mx-auto max-w-2xl text-xl text-blue-100">系统化的剪辑课程，从入门到精通，助你成为优秀的视频创作者</p></div></section><div v-if="errorMessage" class="bg-red-50 px-4 py-4 text-center text-red-700">{{ errorMessage }}</div><section class="px-4 py-20"><div class="mx-auto max-w-7xl"><div v-if="loading" class="py-12 text-center text-gray-500">正在加载课程…</div><div v-else-if="!courses.length" class="py-12 text-center text-gray-500">暂无公开课程</div><div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2">
  <article v-for="course in courses" :key="course.id" class="overflow-hidden rounded-2xl bg-white shadow-lg" :class="{ 'opacity-75': !course.isOnline }"><div :class="[course.colorClass, 'p-6 text-white']"><div class="mb-4 flex items-start justify-between"><div class="flex items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20"><component :is="icons[course.iconName] || Video" class="h-6 w-6" /></div><div><h3 class="text-2xl font-bold">{{ course.courseName }}</h3><span v-if="course.courseTag" class="mt-1 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">{{ course.courseTag }}</span></div></div><span v-if="!course.isOnline" class="rounded-full bg-yellow-500 px-3 py-1 text-xs">即将上线</span></div><p class="text-white/90">{{ course.courseIntro }}</p></div><div class="p-6"><div class="mb-6 flex items-center gap-6 text-sm text-gray-600"><div class="flex items-center gap-2"><Clock class="h-4 w-4" />{{ course.duration || '周期待定' }}</div><div class="flex items-center gap-2"><Video class="h-4 w-4" />{{ course.lessonCount }} 节课</div></div><div class="mb-6"><h4 class="mb-3 font-semibold">课程内容</h4><ul class="space-y-2"><li v-for="feature in course.features" :key="feature" class="flex gap-2 text-sm text-gray-600"><span class="text-green-500">✓</span>{{ feature }}</li></ul></div><div class="flex items-center justify-between border-t pt-6"><div><span class="text-3xl font-bold text-blue-600">¥{{ course.coursePrice }}</span><span class="ml-2 text-gray-500">/ 整套课程</span></div><button class="rounded-md px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400" :class="course.isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'" :disabled="!course.isOnline" @click="selectedCourse = course.isOnline ? course : null">{{ course.isOnline ? '立即报名' : '敬请期待' }}</button></div></div></article>
</div></div></section><section class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-4xl text-center"><h2 class="mb-4 text-3xl font-bold">还在犹豫？</h2><p class="mb-8 text-gray-600">扫描下方二维码，添加课程顾问，获取试听课程和详细课程大纲</p><img v-if="basicInfo?.contactQrCode" :src="basicInfo.contactQrCode" alt="课程顾问二维码" class="mx-auto h-64 w-64 rounded-2xl bg-white object-contain p-4 shadow-lg" /><div v-else class="mx-auto flex h-64 w-64 items-center justify-center rounded-2xl bg-white text-sm text-gray-500 shadow-lg">暂未配置课程顾问二维码</div></div></section><ContactQrModal :open="Boolean(selectedCourse)" :title="selectedCourse ? `报名 ${selectedCourse.courseName}` : '课程报名'" description="联系顾问参加课程，请扫描二维码咨询课程详情" :qr-code-url="basicInfo?.contactQrCode || null" @close="selectedCourse = null" /></div></template>
