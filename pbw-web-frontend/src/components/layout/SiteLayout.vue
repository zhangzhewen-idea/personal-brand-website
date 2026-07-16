<script setup lang="ts">
import { onMounted } from 'vue'
import Navigation from './Navigation.vue'
import Footer from './Footer.vue'
import { useSiteStore } from '@/stores/site.store'

const siteStore = useSiteStore()

onMounted(() => {
  void siteStore.load()
})
</script>

<template>
  <div data-testid="site-layout" class="flex min-h-screen flex-col">
    <Navigation />
    <main class="flex-1"><RouterView /></main>
    <Footer />
  </div>
</template>
