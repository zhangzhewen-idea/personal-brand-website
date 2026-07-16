<script setup lang="ts">
import { milestones } from '@/configs/about.config'
import SectionHeading from '@/components/shared/SectionHeading.vue'
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
    <SectionHeading title="成长里程碑" description="从第一条视频开始，把每一步都记录成继续前进的理由。" />
    <div data-testid="milestones-grid" class="grid gap-5 md:grid-cols-4">
      <article v-for="milestone in milestones" :key="milestone.year" data-testid="milestone" class="rounded-2xl border border-gray-200 p-6">
        <p class="text-3xl font-bold text-amber-500">{{ milestone.year }}</p>
        <h3 class="mt-5 font-semibold">{{ milestone.title }}</h3>
        <p class="mt-3 text-sm leading-6 text-gray-600">{{ milestone.description }}</p>
      </article>
    </div>
  </section>
</template>
