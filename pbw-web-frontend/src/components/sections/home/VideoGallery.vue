<script setup lang="ts">
import type { VideoCardViewModel } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ videos: VideoCardViewModel[] }>()
</script>

<template>
  <section id="video-gallery" data-testid="video-gallery" class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
    <div class="mb-12 flex items-end justify-between gap-4"><SectionHeading title="视频作品" description="记录灵感、方法与每一次创作尝试。" /><span class="text-sm text-gray-500">{{ videos.length }} 部精选内容</span></div>
    <div class="grid gap-6 md:grid-cols-2">
      <article v-for="video in videos" :key="video.id" data-testid="video-card" class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div class="relative aspect-video overflow-hidden bg-gray-100">
          <ResponsiveImage :src="video.videoCover" :alt="video.videoTitle" fallback-text="视频封面" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div v-if="!video.videoCover" class="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-blue-900/80 text-5xl text-white">▶</div>
          <span class="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">{{ video.platform }} · {{ video.views }}</span>
        </div>
        <div class="p-6"><h3 class="text-xl font-semibold">{{ video.videoTitle }}</h3><p class="mt-2 text-sm leading-6 text-gray-600">{{ video.videoIntro }}</p></div>
      </article>
    </div>
  </section>
</template>
