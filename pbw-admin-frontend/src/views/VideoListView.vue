<template>
  <section class="content-list-page">
    <PageHeader title="视频管理" description="查看视频内容与发布记录。">
      <template #actions><el-button type="primary">新增视频</el-button></template>
    </PageHeader>
    <el-alert v-if="store.error" :title="store.error" type="error" :closable="false" show-icon class="state-alert">
      <template #default><el-button type="danger" link @click="retryLoad">重试</el-button></template>
    </el-alert>
    <div class="list-card">
      <ListToolbar placeholder="请输入视频标题" @search="noop" @reset="noop" />
      <DataTableCard :loading="store.loading" :empty="!store.items.length" :total="store.items.length">
        <el-table :data="store.items" row-key="id" stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="视频标题" min-width="220">
            <template #default="{ row }"><strong>{{ row.videoTitle }}</strong></template>
          </el-table-column>
          <el-table-column prop="videoIntro" label="简介" min-width="260"><template #default="{ row }">{{ row.videoIntro || '-' }}</template></el-table-column>
          <el-table-column label="视频 URL" min-width="270"><template #default="{ row }"><a :href="row.videoUrl">{{ row.videoUrl }}</a></template></el-table-column>
          <el-table-column label="封面" width="100"><template #default="{ row }"><MediaThumbnail :src="row.videoCover ?? undefined" :alt="row.videoTitle" /></template></el-table-column>
          <el-table-column label="状态" width="100"><template #default="{ row }"><StatusBadge :deleted="row.isDeleted" /></template></el-table-column>
          <el-table-column label="创建时间" min-width="170"><template #default="{ row }">{{ formatDateTime(row.createTime) }}</template></el-table-column>
          <el-table-column label="更新时间" min-width="170"><template #default="{ row }">{{ formatDateTime(row.updateTime) }}</template></el-table-column>
          <el-table-column label="操作" fixed="right" width="100"><template #default="{ row }"><DeleteAction button-text="删除" :title="`${row.id} · ${row.videoTitle}`" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
        </el-table>
      </DataTableCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useVideoStore } from '@/stores/entities'
import { formatDateTime } from '@/utils/formatters'

const store = useVideoStore()
const noop = () => undefined
const retryLoad = () => { void store.load() }
onMounted(() => { void store.load() })
</script>

<style scoped>
.content-list-page { max-width: 1480px; margin: 0 auto; }
.state-alert { margin-bottom: 20px; }
.list-card { overflow: hidden; border: 1px solid var(--pbw-border); border-radius: 10px; background: var(--pbw-card); }
a { color: var(--pbw-primary); overflow-wrap: anywhere; }
</style>
