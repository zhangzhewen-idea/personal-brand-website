<template>
  <section class="users-page">
    <PageHeader title="用户管理" description="查看用户资料与账号状态。">
      <template #actions>
        <el-button type="primary">新增用户</el-button>
      </template>
    </PageHeader>

    <el-alert v-if="userStore.error" :title="userStore.error" type="error" :closable="false" show-icon class="users-error">
      <template #default><el-button type="danger" link @click="retryLoad">重试</el-button></template>
    </el-alert>

    <div class="list-card">
      <ListToolbar placeholder="请输入昵称、账号或邮箱" @search="noop" @reset="noop" />
      <DataTableCard :loading="userStore.loading" :empty="!userStore.items.length" :total="userStore.items.length">
        <el-table :data="userStore.items" row-key="id" stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="用户" min-width="220">
            <template #default="{ row }">
              <div class="user-cell">
                <MediaThumbnail :src="row.avatar ?? undefined" :alt="row.nickname" round />
                <div><strong>{{ row.nickname }}</strong><span>{{ row.account }}</span></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="190">
            <template #default="{ row }">{{ row.email || '-' }}</template>
          </el-table-column>
          <el-table-column prop="role" label="角色" width="110" />
          <el-table-column label="删除状态" width="110">
            <template #default="{ row }">
              <el-tag :type="row.isDeleted ? 'danger' : 'success'" effect="plain">
                {{ row.isDeleted ? '已删除' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="170">
            <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="170">
            <template #default="{ row }">{{ formatDateTime(row.updateTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template #default="{ row }">
              <el-button link type="primary">查看</el-button>
              <DeleteAction :title="`${row.id} · ${row.nickname}（${row.account}）`" :loading="userStore.submittingId === row.id" :on-delete="() => userStore.remove(row.id)" />
            </template>
          </el-table-column>
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
import { useUserStore } from '@/stores/entities'
import { formatDateTime } from '@/utils/formatters'

const userStore = useUserStore()
const noop = () => undefined
const retryLoad = () => { void userStore.load() }

onMounted(() => { void userStore.load() })
</script>

<style scoped>
.users-page { max-width: 1480px; margin: 0 auto; }
.list-card { overflow: hidden; border: 1px solid var(--pbw-border); border-radius: 10px; background: var(--pbw-card); }
.user-cell { display: flex; align-items: center; gap: 12px; }
.user-cell > div { display: grid; gap: 4px; }
.user-cell span { color: var(--pbw-muted); font-size: 13px; }
</style>
