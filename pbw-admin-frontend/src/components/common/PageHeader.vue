<template>
  <header class="page-header">
    <div class="page-header__copy">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="description" class="page-header__description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
defineSlots<{
  actions?: () => any
}>()
</script>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
.page-header__title { margin: 0; color: var(--pbw-text); font-size: 24px; line-height: 1.3; }
.page-header__description { margin: 8px 0 0; color: var(--pbw-muted); font-size: 14px; }
.page-header__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
@media (max-width: 600px) { .page-header { flex-direction: column; gap: 16px; } .page-header__actions { justify-content: flex-start; width: 100%; } }
</style>
