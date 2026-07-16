<script setup lang="ts">
import type { BasicInfo } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ basicInfo: BasicInfo | null }>()
</script>

<template>
  <section class="bg-gray-50">
    <div class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionHeading title="幕后故事" description="作品之外，还有整理素材、剪辑和一遍遍观看的日常。" />
      <div data-testid="behind-scenes-grid" class="grid gap-5 md:grid-cols-3">
        <ResponsiveImage data-testid="behind-scenes-image" :src="basicInfo?.editingDeskWorkPhoto || null" alt="剪辑工作台" class="aspect-[4/3] w-full rounded-2xl object-cover" />
        <ResponsiveImage data-testid="behind-scenes-image" :src="basicInfo?.assetLibraryScreenshot || null" alt="素材库" class="aspect-[4/3] w-full rounded-2xl object-cover" />
        <ResponsiveImage data-testid="behind-scenes-image" :src="basicInfo?.dailyMovieWatchingPhoto || null" alt="日常观影" class="aspect-[4/3] w-full rounded-2xl object-cover" />
      </div>
      <div class="mt-12 grid gap-8 md:grid-cols-2">
        <div class="rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          <h3 class="text-2xl font-bold">我的年度十佳影片</h3>
          <p class="mt-3 text-sm text-gray-600">这些电影深刻影响了我的剪辑理念。</p>
          <ol class="mt-6 space-y-3 text-gray-700">
            <li v-for="(film, index) in basicInfo?.annualTop10Films || []" :key="film" class="flex gap-3"><span class="font-semibold text-blue-600">{{ String(index + 1).padStart(2, '0') }}</span><span>{{ film }}</span></li>
          </ol>
        </div>
        <div class="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8">
          <h3 class="text-2xl font-bold">影响我的三位导演</h3>
          <p class="mt-3 text-sm text-gray-600">向大师学习，不断精进。</p>
          <ul class="mt-6 space-y-3 text-gray-700">
            <li v-for="(director, index) in basicInfo?.influentialThreeDirectors || []" :key="director" class="flex items-center gap-3 rounded-lg bg-white p-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">{{ index + 1 }}</span><span>{{ director }}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
