<script setup lang="ts">
import type { BasicInfo } from '@/models'
import { formatCount } from '@/shared/formatters'
import { homeHeroPoster } from '@/configs/home.config'
import BaseButton from '@/components/base/BaseButton.vue'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import StatItem from '@/components/shared/StatItem.vue'

defineProps<{ basicInfo: BasicInfo | null }>()

function scrollToGallery() {
  document.getElementById('video-gallery')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section data-testid="video-hero" class="relative isolate overflow-hidden bg-slate-950 text-white">
    <div class="absolute inset-0 -z-10 opacity-35"><ResponsiveImage :src="homeHeroPoster" alt="创作者工作中的电影感画面" class="h-full w-full object-cover" /></div>
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
    <div class="mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
      <p class="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">{{ basicInfo?.authorIdentityTag || '影像创作者' }}</p>
      <h1 class="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">{{ basicInfo?.slogan || '把热爱拍成作品。' }}</h1>
      <p class="mt-6 max-w-xl text-lg text-slate-300">{{ basicInfo?.creationAttitude || '保持好奇，持续创作。' }}</p>
      <div class="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/20 pt-6">
        <StatItem label="总播放" :value="formatCount(basicInfo?.totalPlayCount || 0)" dark />
        <StatItem label="总点赞" :value="formatCount(basicInfo?.totalLikeCount || 0)" dark />
        <StatItem label="总关注" :value="formatCount(basicInfo?.totalFollowerCount || 0)" dark />
      </div>
      <div class="mt-10 flex flex-wrap items-center gap-4">
        <BaseButton data-testid="hero-portfolio-button" size="lg" @click="scrollToGallery">观看作品集</BaseButton>
        <a data-testid="hero-scroll-button" href="#video-gallery" aria-label="向下查看视频" class="rounded-full border border-white/40 px-5 py-3 text-sm transition hover:bg-white hover:text-slate-950">向下探索 ↓</a>
      </div>
    </div>
  </section>
</template>
