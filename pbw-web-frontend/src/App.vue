<script setup lang="ts">
import { onMounted } from 'vue'
import { useSiteStore } from '@/stores/site'

const store = useSiteStore()
onMounted(() => store.restoreSession())
</script>

<template><RouterView /></template>
