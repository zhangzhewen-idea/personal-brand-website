<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  EditPen,
  Film,
  Link,
  Message,
  Picture,
  Pointer,
  User,
  VideoPlay,
  View,
} from '@element-plus/icons-vue'
import BasicInfoDialog from '@/components/BasicInfoDialog.vue'
import PageHeading from '@/components/PageHeading.vue'
import { getApiErrorMessage } from '@/api/client'
import { basicInfoApi, type BasicInfoPayload } from '@/api/modules/basicInfo'
import type { BasicInfo } from '@/types/database'
import { cloneData } from '@/utils/cloneData'

const formatNumber = (value: number) => new Intl.NumberFormat('zh-CN').format(value)
const basicInfo = ref<BasicInfo | null>(null)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogRecord = ref<BasicInfo | null>(null)

const mediaFields = computed(() => [
  { label: '首页封面视频', field: 'homeCoverVideo', value: basicInfo.value?.homeCoverVideo, icon: VideoPlay, kind: 'VIDEO' },
  { label: '联系二维码', field: 'contactQrCode', value: basicInfo.value?.contactQrCode, icon: Picture, kind: 'IMAGE' },
  { label: '作者照片', field: 'authorPhoto', value: basicInfo.value?.authorPhoto, icon: User, kind: 'IMAGE' },
  { label: '剪辑台工作照', field: 'editingDeskWorkPhoto', value: basicInfo.value?.editingDeskWorkPhoto, icon: Film, kind: 'IMAGE' },
  { label: '素材库截图', field: 'assetLibraryScreenshot', value: basicInfo.value?.assetLibraryScreenshot, icon: Picture, kind: 'IMAGE' },
  { label: '观影日常照片', field: 'dailyMovieWatchingPhoto', value: basicInfo.value?.dailyMovieWatchingPhoto, icon: Film, kind: 'IMAGE' },
])

const openDialog = () => {
  dialogRecord.value = basicInfo.value ? cloneData(basicInfo.value) : null
  dialogVisible.value = true
}

const toPayload = (record: BasicInfo): BasicInfoPayload => {
  const { id: _id, createTime: _createTime, updateTime: _updateTime, isDeleted: _isDeleted, ...payload } = record
  return payload
}

const saveBasicInfo = async (record: BasicInfo) => {
  try {
    const { data } = await basicInfoApi.update(record.id, toPayload(record))
    basicInfo.value = data
    dialogVisible.value = false
    ElMessage.success('基本信息已更新')
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '更新基本信息失败'))
  }
}

const loadBasicInfo = async () => {
  loading.value = true
  try {
    const { data } = await basicInfoApi.get()
    basicInfo.value = data
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '加载基本信息失败'))
  } finally {
    loading.value = false
  }
}

onMounted(() => void loadBasicInfo())
</script>

<template>
  <section v-loading="loading">
    <PageHeading
      eyebrow="PROFILE / BASIC INFO"
      title="基本信息管理"
      description="维护个人品牌介绍、核心数据、媒体素材与联系方式。"
    >
      <el-button type="primary" :icon="EditPen" :disabled="!basicInfo" @click="openDialog">编辑基本信息</el-button>
    </PageHeading>

    <div class="metric-grid">
      <article class="panel metric-card">
        <span class="metric-icon is-blue"><View /></span>
        <div><span>全网播放量</span><strong>{{ formatNumber(basicInfo?.totalPlayCount || 0) }}</strong><small>totalPlayCount</small></div>
      </article>
      <article class="panel metric-card">
        <span class="metric-icon is-violet"><Pointer /></span>
        <div><span>全网点赞数</span><strong>{{ formatNumber(basicInfo?.totalLikeCount || 0) }}</strong><small>totalLikeCount</small></div>
      </article>
      <article class="panel metric-card">
        <span class="metric-icon is-green"><User /></span>
        <div><span>全网粉丝数</span><strong>{{ formatNumber(basicInfo?.totalFollowerCount || 0) }}</strong><small>totalFollowerCount</small></div>
      </article>
    </div>

    <div class="info-grid">
      <article class="panel detail-panel">
        <div class="section-title">
          <div><h2>品牌与联系信息</h2><p>核心文字资料与外部联系入口</p></div>
          <span>5 FIELDS</span>
        </div>
        <dl class="detail-list">
          <div><dt>作者身份标签<small>authorIdentityTag</small></dt><dd>{{ basicInfo?.authorIdentityTag || '—' }}</dd></div>
          <div><dt>Slogan<small>slogan</small></dt><dd>{{ basicInfo?.slogan || '—' }}</dd></div>
          <div><dt>创作态度<small>creationAttitude</small></dt><dd>{{ basicInfo?.creationAttitude || '—' }}</dd></div>
          <div>
            <dt>联系邮箱<small>contactEmail</small></dt>
            <dd class="accent-value"><el-icon><Message /></el-icon>{{ basicInfo?.contactEmail || '—' }}</dd>
          </div>
          <div>
            <dt>联系方式<small>contactInfo</small></dt>
            <dd class="accent-value"><el-icon><Link /></el-icon>{{ basicInfo?.contactInfo || '—' }}</dd>
          </div>
        </dl>
      </article>

      <article class="panel preference-panel">
        <div class="section-title">
          <div><h2>内容偏好</h2><p>年度片单与创作影响来源</p></div>
          <span>JSON ARRAY</span>
        </div>
        <div class="tag-section">
          <div class="tag-section__head"><strong>年度十佳影片</strong><small>annualTop10Films</small></div>
          <div class="tag-cloud film-tags">
            <el-tag v-for="film in basicInfo?.annualTop10Films || []" :key="film" effect="plain" round>{{ film }}</el-tag>
          </div>
        </div>
        <div class="tag-section">
          <div class="tag-section__head"><strong>影响我的三位导演</strong><small>influentialThreeDirectors</small></div>
          <div class="tag-cloud">
            <el-tag v-for="director in basicInfo?.influentialThreeDirectors || []" :key="director" type="info" effect="light" round>
              {{ director }}
            </el-tag>
          </div>
        </div>
      </article>
    </div>

    <article class="panel media-panel">
      <div class="section-title">
        <div><h2>媒体资源</h2><p>数据库中配置的视频、图片和品牌素材地址</p></div>
        <span>6 ASSETS</span>
      </div>
      <div class="media-grid">
        <div v-for="(item, index) in mediaFields" :key="item.field" class="media-item">
          <div class="media-preview" :class="`media-preview--${(index % 3) + 1}`">
            <span>{{ item.kind }}</span>
            <video
              v-if="item.kind === 'VIDEO' && item.value"
              :src="item.value"
              :aria-label="item.label"
              autoplay
              muted
              loop
              playsinline
            />
            <img v-else-if="item.value" :src="item.value" :alt="item.label" />
            <el-icon v-else><component :is="item.icon" /></el-icon>
          </div>
          <div class="media-copy">
            <strong>{{ item.label }}</strong>
            <small>{{ item.field }}</small>
          </div>
        </div>
      </div>
    </article>

    <BasicInfoDialog
      v-model="dialogVisible"
      mode="edit"
      :record="dialogRecord"
      @submit="saveBasicInfo"
    />
  </section>
</template>

<style scoped>
.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
}

.metric-icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: none;
  place-items: center;
  border-radius: 12px;
}

.metric-icon :deep(svg) { width: 19px; }
.metric-icon.is-blue { background: #e9f0ff; color: #346fff; }
.metric-icon.is-violet { background: #f1ebff; color: #7c4dff; }
.metric-icon.is-green { background: #e6f8f2; color: #12a87c; }

.metric-card > div {
  display: grid;
  grid-template-columns: auto auto;
  align-items: end;
  column-gap: 8px;
}

.metric-card span { grid-column: 1 / -1; color: #7d899b; font-size: 11px; }
.metric-card strong { color: var(--pbw-ink); font-size: 21px; letter-spacing: -.025em; }
.metric-card small { color: #b0bac8; font-size: 8px; }

.info-grid {
  display: grid;
  grid-template-columns: 1.12fr .88fr;
  gap: 16px;
  margin-top: 16px;
}

.detail-panel,
.preference-panel,
.media-panel {
  padding: 0 22px 22px;
}

.section-title {
  display: flex;
  min-height: 75px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--pbw-line);
}

.section-title h2 { margin: 0; color: var(--pbw-ink); font-size: 15px; font-weight: 680; }
.section-title p { margin: 5px 0 0; color: var(--pbw-muted); font-size: 10px; }
.section-title > span { color: #a7b1bf; font-size: 8px; font-weight: 700; letter-spacing: .12em; }

.detail-list {
  margin: 0;
}

.detail-list > div {
  display: grid;
  min-height: 65px;
  grid-template-columns: 170px 1fr;
  align-items: center;
  border-bottom: 1px solid #eef1f5;
}

.detail-list > div:last-child { border-bottom: 0; }
.detail-list dt { display: flex; flex-direction: column; color: #667085; font-size: 11px; }
.detail-list dt small { margin-top: 4px; color: #b0bac8; font-size: 8px; }
.detail-list dd { margin: 0; color: #354155; font-size: 12px; line-height: 1.6; }
.accent-value { display: flex; align-items: center; gap: 7px; color: var(--pbw-blue) !important; }

.tag-section { padding: 21px 0; border-bottom: 1px solid #eef1f5; }
.tag-section:last-child { border-bottom: 0; }
.tag-section__head { display: flex; justify-content: space-between; margin-bottom: 14px; }
.tag-section__head strong { color: #475569; font-size: 11px; }
.tag-section__head small { color: #b0bac8; font-size: 8px; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.film-tags :deep(.el-tag) { border-color: #dce6f8; color: #5476af; }

.media-panel { margin-top: 16px; }
.media-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; padding-top: 20px; }
.media-item { overflow: hidden; border: 1px solid #e7ecf2; border-radius: 11px; background: #fbfcfe; }
.media-preview { position: relative; display: grid; height: 93px; place-items: center; color: #7f8fa6; }
.media-preview--1 { background: linear-gradient(135deg, #e5ecf6, #f5f7fa); }
.media-preview--2 { background: linear-gradient(135deg, #e8eefb, #f4f6fb); }
.media-preview--3 { background: linear-gradient(135deg, #e7f0ef, #f3f8f7); }
.media-preview > span { position: absolute; top: 8px; left: 9px; color: #8b9aaf; font-size: 7px; font-weight: 750; letter-spacing: .13em; }
.media-preview > span { z-index: 1; padding: 3px 5px; border-radius: 4px; background: rgba(15, 23, 42, .58); color: white; }
.media-preview img,
.media-preview video { width: 100%; height: 100%; object-fit: cover; }
.media-preview :deep(svg) { width: 22px; }
.media-copy { padding: 12px; }
.media-copy strong { display: block; color: #455165; font-size: 11px; }
.media-copy small { display: block; margin-top: 3px; color: #a7b1bf; font-size: 8px; }

@media (max-width: 1080px) {
  .info-grid { grid-template-columns: 1fr; }
  .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
  .metric-grid { grid-template-columns: 1fr; }
  .media-grid { grid-template-columns: 1fr; }
  .detail-list > div { grid-template-columns: 1fr; gap: 9px; padding: 14px 0; }
}
</style>
