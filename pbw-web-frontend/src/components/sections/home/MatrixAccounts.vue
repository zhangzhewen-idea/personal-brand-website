<script setup lang="ts">
import type { MatrixAccountViewModel } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ accounts: MatrixAccountViewModel[] }>()
</script>

<template>
  <section data-testid="matrix-accounts" class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
    <SectionHeading title="全平台矩阵" description="在你喜欢的平台继续关注我的创作。" />
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <a v-for="account in accounts" :key="account.id" data-testid="matrix-card" :href="account.accountUrl || undefined" target="_blank" rel="noreferrer" class="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-gray-900 hover:shadow-md">
        <ResponsiveImage :src="account.platformLogo" :alt="account.platformName" fallback-text="平台" class="mb-5 h-10 w-10 rounded-xl object-cover" />
        <h3 class="font-semibold">{{ account.platformName }}</h3><p class="mt-2 text-sm text-gray-600">{{ account.intro }}</p><p class="mt-5 text-sm font-medium text-gray-900">{{ account.followers }} 粉丝 · {{ account.displayName }}</p>
      </a>
    </div>
  </section>
</template>
