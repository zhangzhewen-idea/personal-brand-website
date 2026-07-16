<template>
  <el-button type="danger" link :loading="loading || confirming || submitting" @click="requestDelete">{{ title }}</el-button>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  loading?: boolean
  onDelete: () => void | Promise<void>
}>(), { title: '删除', loading: false })
const confirming = ref(false)
const submitting = ref(false)

const isCancellation = (reason: unknown) => {
  if (reason === 'cancel' || reason === 'close') return true
  if (typeof reason !== 'object' || reason === null || !('action' in reason)) return false
  const action = (reason as { action?: unknown }).action
  return action === 'cancel' || action === 'close'
}

const requestDelete = async () => {
  if (props.loading || confirming.value || submitting.value) return
  confirming.value = true
  try {
    await ElMessageBox.confirm(`确认删除「${props.title}」？删除后当前测试会话删除、刷新恢复。是否继续？`, '确认删除', { type: 'warning' })
  } catch (error) {
    if (!isCancellation(error)) ElMessage.error('删除确认失败，请稍后重试')
    return
  } finally {
    confirming.value = false
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
