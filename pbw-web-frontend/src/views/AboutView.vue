<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import AboutHero from '@/components/sections/about/AboutHero.vue'
import CreatorStats from '@/components/sections/about/CreatorStats.vue'
import Milestones from '@/components/sections/about/Milestones.vue'
import BehindTheScenes from '@/components/sections/about/BehindTheScenes.vue'
import ContactSection from '@/components/sections/about/ContactSection.vue'
import { useSiteStore } from '@/stores/site.store'

const siteStore = useSiteStore()
const matrixAccounts = computed(() => siteStore.matrixAccounts)

onMounted(() => {
  void siteStore.load()
})
</script>

<template>
  <div data-testid="about-view">
    <div v-if="siteStore.status === 'idle' || siteStore.status === 'loading'" data-testid="about-loading" class="flex min-h-[50vh] items-center justify-center px-6 py-24 text-gray-500">关于页内容加载中…</div>
    <div v-else-if="siteStore.status === 'error'" data-testid="about-error" class="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 py-24 text-center" role="alert">
      <p class="text-lg text-red-600">{{ siteStore.errorMessage || '关于页内容加载失败' }}</p>
      <BaseButton variant="outline" @click="siteStore.load">重新加载</BaseButton>
    </div>
    <template v-else>
      <AboutHero :basic-info="siteStore.basicInfo" :accounts="matrixAccounts" />
      <CreatorStats :basic-info="siteStore.basicInfo" />
      <Milestones />
      <BehindTheScenes :basic-info="siteStore.basicInfo" />
      <ContactSection :basic-info="siteStore.basicInfo" />
    </template>
  </div>
</template>
