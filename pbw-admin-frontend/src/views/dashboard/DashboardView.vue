<template>
  <section class="dashboard-page">
    <div class="page-heading">
      <div><p class="eyebrow">DASHBOARD</p><h1>首页工作台</h1><p>掌握个人品牌内容资产的最新状态。</p></div>
      <el-button type="primary" :loading="dashboardStore.loading" @click="dashboardStore.load"><el-icon><Refresh /></el-icon>刷新数据</el-button>
    </div>

    <el-alert v-if="dashboardStore.error" :title="dashboardStore.error" type="error" show-icon :closable="false" class="dashboard-error" />
    <el-skeleton v-if="dashboardStore.loading && !dashboardStore.summary" :rows="6" animated />
    <template v-else-if="dashboardStore.summary" >
      <div class="stats-grid">
        <el-card v-for="stat in primaryStats" :key="stat.label" shadow="never" class="stat-card">
          <div class="stat-icon" :class="`is-${stat.color}`"><el-icon><component :is="stat.icon" /></el-icon></div>
          <div><p>{{ stat.label }}</p><strong>{{ stat.value }}</strong></div>
        </el-card>
      </div>
      <div class="stats-grid secondary-grid">
        <el-card v-for="stat in reachStats" :key="stat.label" shadow="never" class="stat-card compact-card">
          <p>{{ stat.label }}</p><strong>{{ stat.value }}</strong>
        </el-card>
      </div>
      <el-card shadow="never" class="recent-card">
        <template #header><div class="card-heading"><span>最近更新</span><el-tag type="info" effect="plain">{{ dashboardStore.summary.recentItems.length }} 条</el-tag></div></template>
        <el-empty v-if="!dashboardStore.summary.recentItems.length" description="暂无最近更新" />
        <div v-else class="recent-list">
          <div v-for="item in dashboardStore.summary.recentItems" :key="`${item.type}-${item.id}`" class="recent-item">
            <div><el-tag size="small" effect="plain">{{ item.type }}</el-tag><span class="recent-title">{{ item.title }}</span></div>
            <time>{{ formatDateTime(item.updateTime) }}</time>
          </div>
        </div>
      </el-card>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Collection, Film, Money, Refresh, User, VideoCamera } from '@element-plus/icons-vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import { formatCompactNumber, formatCurrency, formatDateTime } from '@/utils/formatters'

const dashboardStore = useDashboardStore()
const primaryStats = computed(() => {
  const summary = dashboardStore.summary
  if (!summary) return []
  return [
    { label: '用户总数', value: summary.userCount, icon: User, color: 'blue' },
    { label: '视频数量', value: summary.videoCount, icon: VideoCamera, color: 'purple' },
    { label: '素材总价', value: formatCurrency(summary.materialTotalPrice), icon: Money, color: 'orange' },
    { label: '已上线课程', value: summary.onlineCourseCount, icon: Collection, color: 'green' },
  ]
})
const reachStats = computed(() => {
  const summary = dashboardStore.summary
  if (!summary) return []
  return [
    { label: '全网播放', value: formatCompactNumber(summary.totalPlayCount) },
    { label: '全网点赞', value: formatCompactNumber(summary.totalLikeCount) },
    { label: '全网粉丝', value: formatCompactNumber(summary.totalFollowerCount) },
    { label: '矩阵账号', value: summary.matrixAccountCount },
  ]
})

onMounted(() => { void dashboardStore.load() })
</script>

<style scoped>
.dashboard-page { max-width: 1400px; margin: 0 auto; }.page-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; }.page-heading h1 { margin: 0 0 8px; font-size: 30px; color: var(--pbw-text); }.page-heading p:not(.eyebrow) { margin: 0; color: var(--pbw-muted); }.eyebrow { margin: 0 0 10px; color: var(--pbw-primary); font-size: 11px; letter-spacing: .16em; }.dashboard-error { margin-bottom: 20px; }.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }.stat-card :deep(.el-card__body) { display: flex; align-items: center; gap: 14px; min-height: 112px; }.stat-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; font-size: 21px; }.is-blue { color: #5170f4; background: #eef1ff; }.is-purple { color: #8c68d8; background: #f4efff; }.is-orange { color: #dd8a38; background: #fff4e7; }.is-green { color: #3cac7a; background: #eaf9f1; }.stat-card p, .compact-card p { margin: 0 0 8px; color: var(--pbw-muted); font-size: 13px; }.stat-card strong, .compact-card strong { color: var(--pbw-text); font-size: 26px; font-weight: 650; }.secondary-grid { margin-top: 16px; }.compact-card :deep(.el-card__body) { min-height: 92px; }.recent-card { margin-top: 16px; }.card-heading { display: flex; align-items: center; justify-content: space-between; font-weight: 600; }.recent-list { display: grid; gap: 4px; }.recent-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 13px 0; border-bottom: 1px solid var(--pbw-border); }.recent-item:last-child { border-bottom: 0; }.recent-item > div { display: flex; align-items: center; min-width: 0; gap: 10px; }.recent-title { overflow: hidden; color: var(--pbw-text); text-overflow: ellipsis; white-space: nowrap; }.recent-item time { flex-shrink: 0; color: var(--pbw-muted); font-size: 13px; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .page-heading { align-items: flex-start; flex-direction: column; }.page-heading h1 { font-size: 26px; }.stats-grid { grid-template-columns: 1fr; }.secondary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.recent-item { align-items: flex-start; flex-direction: column; gap: 8px; } }
</style>
