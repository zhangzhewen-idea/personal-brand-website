<script setup lang="ts">
import type { BasicInfo } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ basicInfo: BasicInfo | null }>()
</script>

<template>
  <section class="bg-gray-50">
    <div class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionHeading title="幕后日常" description="作品之外，还有整理素材、剪辑和一遍遍观看的日常。" />
      <div data-testid="behind-scenes-grid" class="grid gap-5 md:grid-cols-3">
        <ResponsiveImage data-testid="behind-scenes-image" :src="basicInfo?.editingDeskWorkPhoto || null" alt="剪辑工作台" class="aspect-[4/3] w-full rounded-2xl object-cover" />
        <ResponsiveImage data-testid="behind-scenes-image" :src="basicInfo?.assetLibraryScreenshot || null" alt="素材库" class="aspect-[4/3] w-full rounded-2xl object-cover" />
        <ResponsiveImage data-testid="behind-scenes-image" :src="basicInfo?.dailyMovieWatchingPhoto || null" alt="日常观影" class="aspect-[4/3] w-full rounded-2xl object-cover" />
      </div>
    </div>
  </section>
</template>
