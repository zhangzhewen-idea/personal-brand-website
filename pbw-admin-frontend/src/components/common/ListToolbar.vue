<template>
  <div class="list-toolbar">
    <el-input v-model="keyword" :placeholder="placeholder" clearable class="list-toolbar__keyword" />
    <el-select v-model="status" placeholder="状态" clearable class="list-toolbar__status">
      <el-option label="启用" value="enabled" />
      <el-option label="禁用" value="disabled" />
    </el-select>
    <div class="list-toolbar__actions">
      <el-button type="primary" @click="emit('search')">查询</el-button>
      <el-button @click="reset(); emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: '请输入关键词' })
const emit = defineEmits<{
  search: []
  reset: []
}>()
const keyword = ref('')
const status = ref('')
const reset = () => { keyword.value = ''; status.value = '' }
</script>

<style scoped>
.list-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid var(--pbw-border); background: var(--pbw-card); }
.list-toolbar__keyword { width: min(280px, 100%); }
.list-toolbar__status { width: 140px; }
.list-toolbar__actions { display: flex; gap: 8px; }
@media (max-width: 600px) { .list-toolbar__keyword, .list-toolbar__status { width: 100%; } .list-toolbar__actions { width: 100%; } .list-toolbar__actions .el-button { flex: 1; } }
</style>
