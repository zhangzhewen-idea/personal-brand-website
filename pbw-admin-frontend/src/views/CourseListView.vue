<template>
  <section class="content-list-page">
    <PageHeader title="课程管理" description="查看课程商品、上架状态与在线状态。"><template #actions><el-button type="primary">新增课程</el-button></template></PageHeader>
    <el-alert v-if="store.error" :title="store.error" type="error" :closable="false" show-icon class="state-alert"><template #default><el-button type="danger" link @click="retryLoad">重试</el-button></template></el-alert>
    <div class="list-card"><ListToolbar placeholder="请输入课程名称" @search="noop" @reset="noop" /><DataTableCard :loading="store.loading" :empty="!store.items.length" :total="store.items.length">
      <el-table :data="store.items" row-key="id" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="courseName" label="课程名称" min-width="200" />
        <el-table-column label="标签" min-width="200"><template #default="{ row }">{{ row.courseTag || '-' }}</template></el-table-column>
        <el-table-column label="简介" min-width="260"><template #default="{ row }">{{ row.courseIntro || '-' }}</template></el-table-column>
        <el-table-column label="课程价格" width="120"><template #default="{ row }">{{ formatCurrency(row.coursePrice) }}</template></el-table-column>
        <el-table-column label="是否上架" width="110"><template #default="{ row }"><el-tag :type="row.isOnline ? 'success' : 'info'" effect="plain">{{ row.isOnline ? '已上架' : '未上架' }}</el-tag></template></el-table-column>
        <el-table-column label="在线状态" width="110"><template #default="{ row }">{{ row.isOnline ? '在线' : '离线' }}</template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{ row }"><StatusBadge :deleted="row.isDeleted" /></template></el-table-column>
        <el-table-column label="创建时间" min-width="170"><template #default="{ row }">{{ formatDateTime(row.createTime) }}</template></el-table-column>
        <el-table-column label="更新时间" min-width="170"><template #default="{ row }">{{ formatDateTime(row.updateTime) }}</template></el-table-column>
        <el-table-column label="操作" fixed="right" width="100"><template #default="{ row }"><DeleteAction button-text="删除" :title="`${row.id} · ${row.courseName}`" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useCourseStore } from '@/stores/entities'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
const store = useCourseStore()
const noop = () => undefined
const retryLoad = () => { void store.load() }
onMounted(() => { void store.load() })
</script>

<style scoped>
.content-list-page { max-width: 1480px; margin: 0 auto; }
.state-alert { margin-bottom: 20px; }
.list-card { overflow: hidden; border: 1px solid var(--pbw-border); border-radius: 10px; background: var(--pbw-card); }
</style>
