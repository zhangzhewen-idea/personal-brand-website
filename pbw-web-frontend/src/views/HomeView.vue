<script setup lang="ts">
import { computed, onMounted } from 'vue'
import VideoHero from '@/components/sections/home/VideoHero.vue'
import VideoGallery from '@/components/sections/home/VideoGallery.vue'
import MaterialLibrary from '@/components/sections/home/MaterialLibrary.vue'
import MatrixAccounts from '@/components/sections/home/MatrixAccounts.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useSiteStore } from '@/stores/site.store'

const siteStore = useSiteStore()
const matrixAccounts = computed(() => siteStore.matrixAccounts)

onMounted(() => {
  void siteStore.load()
})
</script>

<template>
  <div data-testid="home-view">
    <div v-if="siteStore.status === 'idle' || siteStore.status === 'loading'" data-testid="home-loading" class="flex min-h-[50vh] items-center justify-center px-6 py-24 text-gray-500">首页内容加载中…</div>
    <div v-else-if="siteStore.status === 'error'" data-testid="home-error" class="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 py-24 text-center" role="alert">
      <p class="text-lg text-red-600">{{ siteStore.errorMessage || '首页内容加载失败' }}</p>
      <BaseButton variant="outline" @click="siteStore.load">重新加载</BaseButton>
    </div>
    <template v-else>
      <VideoHero :basic-info="siteStore.basicInfo" />
      <VideoGallery :videos="siteStore.videos" />
      <MaterialLibrary :materials="siteStore.materials" />
      <MatrixAccounts :accounts="matrixAccounts" />
    </template>
  </div>
</template>
