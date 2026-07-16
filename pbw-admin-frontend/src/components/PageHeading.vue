<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="page-heading">
    <div>
      <span class="page-heading__eyebrow">{{ eyebrow }}</span>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div class="page-heading__action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.page-heading__eyebrow {
  display: block;
  margin-bottom: 7px;
  color: var(--pbw-blue);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.14em;
}

h1 {
  margin: 0;
  color: var(--pbw-ink);
  font-size: 27px;
  font-weight: 720;
  letter-spacing: -0.025em;
}

p {
  margin: 8px 0 0;
  color: var(--pbw-muted);
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-heading__action,
  .page-heading__action :deep(.el-button) {
    width: 100%;
  }
}
</style>
