<template>
  <section class="content-list-page">
    <PageHeader title="矩阵账号" description="查看各平台账号与内容分发入口。"><template #actions><el-button type="primary">新增账号</el-button></template></PageHeader>
    <el-alert v-if="store.error" :title="store.error" type="error" :closable="false" show-icon class="state-alert"><template #default><el-button type="danger" link @click="retryLoad">重试</el-button></template></el-alert>
    <div class="list-card"><ListToolbar placeholder="请输入平台名称" @search="noop" @reset="noop" /><DataTableCard :loading="store.loading" :empty="!store.items.length" :total="store.items.length">
      <el-table :data="store.items" row-key="id" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="平台名称" min-width="160"><template #default="{ row }"><div class="account-cell"><MediaThumbnail :src="row.platformLogo ?? undefined" :alt="row.platformName" round /><strong>{{ row.platformName }}</strong></div></template></el-table-column>
        <el-table-column label="Logo" width="100"><template #default="{ row }"><MediaThumbnail :src="row.platformLogo ?? undefined" :alt="row.platformName" /></template></el-table-column>
        <el-table-column label="账号链接" min-width="270"><template #default="{ row }"><a v-if="row.accountUrl" :href="row.accountUrl">{{ row.accountUrl }}</a><span v-else>-</span></template></el-table-column>
        <el-table-column label="简介" min-width="260"><template #default="{ row }">{{ row.intro || '-' }}</template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{ row }"><StatusBadge :deleted="row.isDeleted" /></template></el-table-column>
        <el-table-column label="创建时间" min-width="170"><template #default="{ row }">{{ formatDateTime(row.createTime) }}</template></el-table-column>
        <el-table-column label="更新时间" min-width="170"><template #default="{ row }">{{ formatDateTime(row.updateTime) }}</template></el-table-column>
        <el-table-column label="操作" fixed="right" width="100"><template #default="{ row }"><DeleteAction button-text="删除" :title="`${row.id} · ${row.platformName}`" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard></div>
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
import { useMatrixAccountStore } from '@/stores/entities'
import { formatDateTime } from '@/utils/formatters'
const store = useMatrixAccountStore()
const noop = () => undefined
const retryLoad = () => { void store.load() }
onMounted(() => { void store.load() })
</script>

<style scoped>
.content-list-page { max-width: 1480px; margin: 0 auto; }
.state-alert { margin-bottom: 20px; }
.list-card { overflow: hidden; border: 1px solid var(--pbw-border); border-radius: 10px; background: var(--pbw-card); }
.account-cell { display: flex; align-items: center; gap: 10px; }
a { color: var(--pbw-primary); overflow-wrap: anywhere; }
</style>
