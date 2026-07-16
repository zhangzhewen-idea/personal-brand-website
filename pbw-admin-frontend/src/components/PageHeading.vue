<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="page-actions">
    <slot />
  </div>
</template>

<style scoped>
.page-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 18px;
}

.page-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

@media (max-width: 640px) {
  .page-actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .page-actions :deep(.el-button) {
    width: 100%;
    margin-left: 0;
  }
}
</style>
