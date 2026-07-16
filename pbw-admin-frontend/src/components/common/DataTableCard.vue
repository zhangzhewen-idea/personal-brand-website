<template>
  <section v-loading="loading" class="data-table-card">
    <div v-if="empty" class="data-table-card__empty">暂无数据</div>
    <div v-else class="data-table-card__content"><slot /></div>
    <footer class="data-table-card__footer">
      <span class="data-table-card__total">共 {{ total }} 条</span>
      <el-pagination :total="total" layout="prev, pager, next" disabled />
    </footer>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  loading?: boolean
  empty?: boolean
  total?: number
}>(), { loading: false, empty: false, total: 0 })
</script>

<style scoped>
.data-table-card { overflow: hidden; border: 1px solid var(--pbw-border); border-radius: 10px; background: var(--pbw-card); }
.data-table-card__content { min-height: 180px; }
.data-table-card__empty { display: grid; min-height: 180px; place-items: center; color: var(--pbw-muted); }
.data-table-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; border-top: 1px solid var(--pbw-border); }
.data-table-card__total { color: var(--pbw-muted); font-size: 13px; }
@media (max-width: 600px) { .data-table-card__footer { align-items: flex-start; flex-direction: column; } }
</style>
