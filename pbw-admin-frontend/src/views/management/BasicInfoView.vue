<script setup lang="ts">
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
import PageHeading from '@/components/PageHeading.vue'
import { basicInfo } from '@/data/mockData'

const formatNumber = (value: number) => new Intl.NumberFormat('zh-CN').format(value)
const prototypeNotice = () => ElMessage.info('当前为前端原型，编辑功能将在后端接口接入后开放')

const mediaFields = [
  { label: '首页封面视频', field: 'homeCoverVideo', value: basicInfo.homeCoverVideo, icon: VideoPlay, kind: 'VIDEO' },
  { label: '联系二维码', field: 'contactQrCode', value: basicInfo.contactQrCode, icon: Picture, kind: 'IMAGE' },
  { label: '作者照片', field: 'authorPhoto', value: basicInfo.authorPhoto, icon: User, kind: 'IMAGE' },
  { label: '剪辑台工作照', field: 'editingDeskWorkPhoto', value: basicInfo.editingDeskWorkPhoto, icon: Film, kind: 'IMAGE' },
  { label: '素材库截图', field: 'assetLibraryScreenshot', value: basicInfo.assetLibraryScreenshot, icon: Picture, kind: 'IMAGE' },
  { label: '观影日常照片', field: 'dailyMovieWatchingPhoto', value: basicInfo.dailyMovieWatchingPhoto, icon: Film, kind: 'IMAGE' },
]
</script>

<template>
  <section>
    <PageHeading
      eyebrow="PROFILE / BASIC INFO"
      title="基本信息管理"
      description="维护个人品牌介绍、核心数据、媒体素材与联系方式。"
    >
      <el-button type="primary" :icon="EditPen" @click="prototypeNotice">编辑基本信息</el-button>
    </PageHeading>

    <article class="profile-hero">
      <div class="profile-hero__mesh"></div>
      <div class="profile-hero__content">
        <span class="profile-symbol"><Film /></span>
        <div>
          <span class="profile-label">CREATOR PROFILE · ID {{ basicInfo.id }}</span>
          <h2>{{ basicInfo.slogan }}</h2>
          <p>{{ basicInfo.authorIdentityTag }}</p>
        </div>
      </div>
      <blockquote>“{{ basicInfo.creationAttitude }}”</blockquote>
      <span class="record-state"><i></i> 数据状态：{{ basicInfo.isDeleted ? '已删除' : '正常' }}</span>
    </article>

    <div class="metric-grid">
      <article class="panel metric-card">
        <span class="metric-icon is-blue"><View /></span>
        <div><span>全网播放量</span><strong>{{ formatNumber(basicInfo.totalPlayCount) }}</strong><small>totalPlayCount</small></div>
      </article>
      <article class="panel metric-card">
        <span class="metric-icon is-violet"><Pointer /></span>
        <div><span>全网点赞数</span><strong>{{ formatNumber(basicInfo.totalLikeCount) }}</strong><small>totalLikeCount</small></div>
      </article>
      <article class="panel metric-card">
        <span class="metric-icon is-green"><User /></span>
        <div><span>全网粉丝数</span><strong>{{ formatNumber(basicInfo.totalFollowerCount) }}</strong><small>totalFollowerCount</small></div>
      </article>
    </div>

    <div class="info-grid">
      <article class="panel detail-panel">
        <div class="section-title">
          <div><h2>品牌与联系信息</h2><p>核心文字资料与外部联系入口</p></div>
          <span>5 FIELDS</span>
        </div>
        <dl class="detail-list">
          <div><dt>作者身份标签<small>authorIdentityTag</small></dt><dd>{{ basicInfo.authorIdentityTag }}</dd></div>
          <div><dt>Slogan<small>slogan</small></dt><dd>{{ basicInfo.slogan }}</dd></div>
          <div><dt>创作态度<small>creationAttitude</small></dt><dd>{{ basicInfo.creationAttitude }}</dd></div>
          <div>
            <dt>联系邮箱<small>contactEmail</small></dt>
            <dd class="accent-value"><el-icon><Message /></el-icon>{{ basicInfo.contactEmail }}</dd>
          </div>
          <div>
            <dt>联系方式<small>contactInfo</small></dt>
            <dd class="accent-value"><el-icon><Link /></el-icon>{{ basicInfo.contactInfo }}</dd>
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
            <el-tag v-for="film in basicInfo.annualTop10Films" :key="film" effect="plain" round>{{ film }}</el-tag>
          </div>
        </div>
        <div class="tag-section">
          <div class="tag-section__head"><strong>影响我的三位导演</strong><small>influentialThreeDirectors</small></div>
          <div class="tag-cloud">
            <el-tag v-for="director in basicInfo.influentialThreeDirectors" :key="director" type="info" effect="light" round>
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
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <div class="media-copy">
            <strong>{{ item.label }}</strong>
            <small>{{ item.field }}</small>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </article>

    <article class="panel system-fields">
      <div><span>记录 ID</span><strong>{{ basicInfo.id }}</strong><small>id</small></div>
      <div><span>创建时间</span><strong>{{ basicInfo.createTime }}</strong><small>createTime</small></div>
      <div><span>更新时间</span><strong>{{ basicInfo.updateTime }}</strong><small>updateTime</small></div>
      <div><span>删除标记</span><strong>{{ basicInfo.isDeleted ? '1 · 已删除' : '0 · 正常' }}</strong><small>isDeleted</small></div>
    </article>
  </section>
</template>

<style scoped>
.profile-hero {
  position: relative;
  display: flex;
  overflow: hidden;
  min-height: 170px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  box-sizing: border-box;
  padding: 32px 36px;
  border-radius: var(--pbw-radius);
  background: #111b2d;
  box-shadow: var(--pbw-shadow);
  color: white;
}

.profile-hero__mesh {
  position: absolute;
  inset: 0;
  opacity: .18;
  background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(to left, black, transparent 75%);
}

.profile-hero__content,
.profile-hero blockquote,
.record-state {
  position: relative;
  z-index: 2;
}

.profile-hero__content {
  display: flex;
  align-items: center;
  gap: 19px;
}

.profile-symbol {
  display: grid;
  width: 66px;
  height: 66px;
  flex: none;
  place-items: center;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 17px;
  background: rgba(255,255,255,.06);
  color: #79a4ff;
}

.profile-symbol :deep(svg) { width: 27px; }

.profile-label {
  color: #6686bb;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: .16em;
}

.profile-hero h2 {
  margin: 8px 0 5px;
  font-size: 24px;
  font-weight: 650;
}

.profile-hero p {
  margin: 0;
  color: #90a0b7;
  font-size: 12px;
}

.profile-hero blockquote {
  max-width: 330px;
  margin: 0;
  color: #aebbd0;
  font-size: 14px;
  font-weight: 350;
  line-height: 1.75;
}

.record-state {
  position: absolute;
  right: 20px;
  bottom: 17px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #687c9c;
  font-size: 9px;
}

.record-state i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #34d399;
}

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
.media-preview :deep(svg) { width: 22px; }
.media-copy { padding: 12px; }
.media-copy strong { display: block; color: #455165; font-size: 11px; }
.media-copy small { display: block; margin-top: 3px; color: #a7b1bf; font-size: 8px; }
.media-copy p { overflow: hidden; margin: 9px 0 0; color: #8b96a6; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }

.system-fields {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 16px;
  padding: 18px 22px;
}

.system-fields div { display: flex; flex-direction: column; padding: 0 20px; border-right: 1px solid var(--pbw-line); }
.system-fields div:first-child { padding-left: 0; }
.system-fields div:last-child { border-right: 0; }
.system-fields span { color: #8995a6; font-size: 9px; }
.system-fields strong { margin: 6px 0 4px; color: #455165; font-size: 11px; font-weight: 650; }
.system-fields small { color: #b0bac8; font-size: 8px; }

@media (max-width: 1080px) {
  .profile-hero blockquote { display: none; }
  .info-grid { grid-template-columns: 1fr; }
  .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
  .profile-hero { align-items: flex-start; padding: 25px; }
  .metric-grid, .system-fields { grid-template-columns: 1fr; }
  .system-fields div { padding: 13px 0; border-right: 0; border-bottom: 1px solid var(--pbw-line); }
  .media-grid { grid-template-columns: 1fr; }
  .detail-list > div { grid-template-columns: 1fr; gap: 9px; padding: 14px 0; }
}
</style>
