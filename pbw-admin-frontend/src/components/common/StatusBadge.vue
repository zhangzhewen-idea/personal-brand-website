<template>
  <el-tag :type="deleted ? 'danger' : 'success'" effect="plain">
    {{ deleted ? '已删除' : '正常' }}
  </el-tag>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ deleted?: boolean }>(), { deleted: false })
</script>
