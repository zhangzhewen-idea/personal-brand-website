<script setup lang="ts">
import type { BasicInfo, MatrixAccountViewModel } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'

defineProps<{
  basicInfo: BasicInfo | null
  accounts: MatrixAccountViewModel[]
}>()

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  black: 'bg-black',
  red: 'bg-red-500',
}
</script>

<template>
  <section data-testid="about-hero" class="bg-slate-950 text-white">
    <div class="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8">
      <div>
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">{{ basicInfo?.authorIdentityTag || '影像创作者' }}</p>
        <h1 class="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">关于我</h1>
        <p class="mt-5 text-2xl font-medium text-white">{{ basicInfo?.slogan || '把热爱拍成作品。' }}</p>
        <p class="mt-6 max-w-xl text-lg text-slate-300">{{ basicInfo?.creationAttitude || '保持好奇，持续创作。' }}</p>
        <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="about-matrix-grid">
          <a v-for="account in accounts" :key="account.id" data-testid="about-matrix-card" :href="account.accountUrl || undefined" target="_blank" rel="noreferrer" class="rounded-full px-4 py-2 text-sm text-white transition-transform hover:scale-105" :class="colorMap[account.color] || 'bg-slate-600'">
            {{ account.platformName }} · {{ account.displayName }} · {{ account.followers }}
          </a>
        </div>
      </div>
      <ResponsiveImage data-testid="author-photo" :src="basicInfo?.authorPhoto || null" alt="创作者头像" fallback-text="创作者头像" class="mx-auto aspect-square w-full max-w-md rounded-[2rem] object-cover" />
    </div>
  </section>
</template>
