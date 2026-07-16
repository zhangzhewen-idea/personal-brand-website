<script setup lang="ts">
import type { BasicInfo } from '@/models'
import { formatCount } from '@/shared/formatters'
import StatItem from '@/components/shared/StatItem.vue'

defineProps<{ basicInfo: BasicInfo | null }>()
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
    <div data-testid="creator-stats-grid" class="grid gap-6 rounded-3xl bg-amber-50 px-6 py-10 sm:grid-cols-3">
      <div data-testid="creator-stat"><StatItem label="总播放" :value="formatCount(basicInfo?.totalPlayCount || 0)" /></div>
      <div data-testid="creator-stat"><StatItem label="总点赞" :value="formatCount(basicInfo?.totalLikeCount || 0)" /></div>
      <div data-testid="creator-stat"><StatItem label="总关注" :value="formatCount(basicInfo?.totalFollowerCount || 0)" /></div>
    </div>
  </section>
</template>
