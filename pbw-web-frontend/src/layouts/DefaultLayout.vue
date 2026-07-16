<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
import AppNavigation from '@/components/layout/AppNavigation.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavigation />
    <main class="flex-1"><RouterView /></main>
    <AppFooter />
  </div>
</template>
