<template>
  <el-button type="danger" link :loading="loading || submitting" @click="confirmDelete">{{ title }}</el-button>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  loading?: boolean
  onDelete: () => void | Promise<void>
}>(), { title: '删除', loading: false })
const submitting = ref(false)

const confirmDelete = async () => {
  if (submitting.value) return
  try {
    await ElMessageBox.confirm('删除后当前测试会话删除、刷新恢复。是否继续？', '确认删除', { type: 'warning' })
  } catch {
    return
  }
  submitting.value = true
  try {
    await props.onDelete()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '删除失败')
  } finally {
    submitting.value = false
  }
}
</script>
