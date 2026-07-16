<template>
  <section class="basic-info-page">
    <PageHeader title="基本信息" description="管理个人品牌对外展示的单例配置。">
      <template #actions><el-button type="primary">编辑信息</el-button></template>
    </PageHeader>

    <el-alert v-if="basicInfoStore.error" :title="basicInfoStore.error" type="error" :closable="false" show-icon class="state-alert">
      <template #default><el-button type="danger" link @click="loadInfo">重试</el-button></template>
    </el-alert>
    <el-skeleton v-if="basicInfoStore.loading && !basicInfoStore.info" :rows="8" animated />
    <template v-else-if="basicInfoStore.info">
      <div class="stats-grid">
        <el-card v-for="stat in stats" :key="stat.label" shadow="never"><span>{{ stat.label }}</span><strong>{{ stat.value }}</strong></el-card>
      </div>
      <el-card shadow="never" class="info-card">
        <template #header><h2>品牌文案</h2></template>
        <dl class="field-grid">
          <div><dt>作者身份标签</dt><dd>{{ info.authorIdentityTag || '-' }}</dd></div>
          <div><dt>slogan</dt><dd>{{ info.slogan || '-' }}</dd></div>
          <div class="wide"><dt>创作态度</dt><dd>{{ info.creationAttitude || '-' }}</dd></div>
        </dl>
      </el-card>
      <el-card shadow="never" class="info-card">
        <template #header><h2>联系方式</h2></template>
        <dl class="field-grid">
          <div><dt>联系邮箱</dt><dd>{{ info.contactEmail || '-' }}</dd></div>
          <div><dt>联系方式</dt><dd>{{ info.contactInfo || '-' }}</dd></div>
          <div class="wide"><dt>联系二维码</dt><dd>{{ info.contactQrCode || '-' }}</dd></div>
        </dl>
      </el-card>
      <el-card shadow="never" class="info-card">
        <template #header><h2>内容偏好</h2></template>
        <dl class="field-grid">
          <div><dt>年度十佳影片</dt><dd>{{ info.annualTop10Films.join('、') || '-' }}</dd></div>
          <div><dt>影响我的三位导演</dt><dd>{{ info.influentialThreeDirectors.join('、') || '-' }}</dd></div>
        </dl>
      </el-card>
      <el-card shadow="never" class="info-card">
        <template #header><h2>媒体资源</h2></template>
        <div class="media-grid">
          <div v-for="media in mediaResources" :key="media.label"><MediaThumbnail :src="media.src ?? undefined" :alt="media.label" /><span>{{ media.label }}</span></div>
        </div>
      </el-card>
      <el-card shadow="never" class="info-card">
        <template #header><h2>记录信息</h2></template>
        <dl class="field-grid meta-grid">
          <div><dt>ID</dt><dd>{{ info.id }}</dd></div>
          <div><dt>状态</dt><dd>{{ info.isDeleted ? '已删除' : '正常' }}</dd></div>
          <div><dt>创建时间</dt><dd>{{ formatDateTime(info.createTime) }}</dd></div>
          <div><dt>更新时间</dt><dd>{{ formatDateTime(info.updateTime) }}</dd></div>
        </dl>
      </el-card>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { BasicInfo } from '@/models/entities'
import { useBasicInfoStore } from '@/stores/basic-info.store'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { formatCompactNumber, formatDateTime } from '@/utils/formatters'

const basicInfoStore = useBasicInfoStore()
const info = computed(() => basicInfoStore.info as BasicInfo)
const stats = computed(() => info.value ? [
  { label: '全网播放量', value: formatCompactNumber(info.value.totalPlayCount) },
  { label: '全网点赞数', value: formatCompactNumber(info.value.totalLikeCount) },
  { label: '全网粉丝数', value: formatCompactNumber(info.value.totalFollowerCount) },
] : [])
const mediaResources = computed(() => info.value ? [
  { label: '首页封面视频', src: info.value.homeCoverVideo },
  { label: '作者照片', src: info.value.authorPhoto },
  { label: '剪辑台工作照', src: info.value.editingDeskWorkPhoto },
  { label: '素材库截图', src: info.value.assetLibraryScreenshot },
  { label: '观影日常照片', src: info.value.dailyMovieWatchingPhoto },
] : [])
const loadInfo = async () => {
  try { await basicInfoStore.load() } catch { /* 错误已展示在页面 */ }
}

onMounted(() => { void loadInfo() })
</script>

<style scoped>
.basic-info-page { max-width: 1200px; margin: 0 auto; }
.state-alert { margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
.stats-grid :deep(.el-card__body) { display: grid; gap: 8px; min-height: 104px; }
.stats-grid span, dt { color: var(--pbw-muted); font-size: 13px; }
.stats-grid strong { color: var(--pbw-text); font-size: 26px; }
.info-card { margin-bottom: 16px; }
.info-card h2 { margin: 0; font-size: 16px; }
.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 32px; margin: 0; }
.field-grid > div { min-width: 0; }.field-grid .wide { grid-column: 1 / -1; }
dt { margin-bottom: 7px; } dd { margin: 0; color: var(--pbw-text); line-height: 1.6; overflow-wrap: anywhere; }
.media-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px; }
.media-grid > div { display: grid; justify-items: center; gap: 8px; color: var(--pbw-muted); font-size: 13px; text-align: center; }
.meta-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
@media (max-width: 760px) { .stats-grid, .field-grid, .meta-grid { grid-template-columns: 1fr; }.field-grid .wide { grid-column: auto; }.media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
