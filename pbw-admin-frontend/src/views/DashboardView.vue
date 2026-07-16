<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Coin,
  Files,
  Film,
  MoreFilled,
  Pointer,
  TrendCharts,
  User,
  VideoCamera,
  View,
} from '@element-plus/icons-vue'
import { basicInfo, courses, materials, matrixAccounts, users, videos } from '@/data/mockData'

const router = useRouter()

const formatCompactNumber = (value: number) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)}kw`
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  return String(value)
}

const stats = [
  {
    label: '全网播放量',
    value: formatCompactNumber(basicInfo.totalPlayCount),
    caption: '内容持续被看见',
    trend: '+18.6%',
    icon: View,
    tone: 'blue',
  },
  {
    label: '全网点赞数',
    value: formatCompactNumber(basicInfo.totalLikeCount),
    caption: '互动表现稳定',
    trend: '+9.2%',
    icon: Pointer,
    tone: 'violet',
  },
  {
    label: '全网粉丝数',
    value: formatCompactNumber(basicInfo.totalFollowerCount),
    caption: '账号矩阵共计',
    trend: '+6.8%',
    icon: User,
    tone: 'green',
  },
  {
    label: '已上线课程',
    value: String(courses.filter((item) => item.isOnline).length),
    caption: `共 ${courses.length} 门课程`,
    trend: '66.7%',
    icon: Coin,
    tone: 'orange',
  },
]

const contentSummary = [
  { label: '视频作品', value: videos.length, unit: '条', icon: VideoCamera, path: '/videos' },
  { label: '素材产品', value: materials.length, unit: '份', icon: Files, path: '/materials' },
  { label: '矩阵账号', value: matrixAccounts.length, unit: '个', icon: TrendCharts, path: '/matrix-accounts' },
  { label: '系统用户', value: users.length, unit: '人', icon: User, path: '/users' },
]

const latestVideos = videos.slice(0, 3)
</script>

<template>
  <section>
    <div class="dashboard-heading">
      <div>
        <span class="dashboard-kicker">OVERVIEW / 2026</span>
        <h1>早上好，管理员</h1>
        <p>这里是 PBW 内容资产的当前概览，今天也保持创作有序。</p>
      </div>
      <div class="dashboard-date">
        <span>JUL</span>
        <strong>17</strong>
        <i></i>
        <small>星期五<br />2026</small>
      </div>
    </div>

    <div class="stat-grid">
      <article v-for="stat in stats" :key="stat.label" class="panel stat-card">
        <div class="stat-card__top">
          <span class="stat-icon" :class="`is-${stat.tone}`"><component :is="stat.icon" /></span>
          <span class="stat-trend"><el-icon><TrendCharts /></el-icon>{{ stat.trend }}</span>
        </div>
        <span class="stat-card__label">{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
        <small>{{ stat.caption }}</small>
      </article>
    </div>

    <div class="dashboard-grid">
      <article class="panel content-overview">
        <div class="panel-heading">
          <div><h2>内容资产</h2><p>数据库中的核心内容模块</p></div>
          <el-button text :icon="MoreFilled" circle aria-label="更多" />
        </div>
        <div class="content-summary-grid">
          <button
            v-for="item in contentSummary"
            :key="item.label"
            class="content-summary-item"
            type="button"
            @click="router.push(item.path)"
          >
            <span><component :is="item.icon" /></span>
            <div><strong>{{ item.value }}<small>{{ item.unit }}</small></strong><p>{{ item.label }}</p></div>
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </article>

      <article class="panel profile-card">
        <div class="profile-card__accent"></div>
        <div class="profile-card__head">
          <span class="profile-avatar"><Film /></span>
          <el-tag type="primary" effect="light" round>品牌资料已配置</el-tag>
        </div>
        <span class="profile-card__label">CREATOR PROFILE</span>
        <h2>{{ basicInfo.slogan }}</h2>
        <p>{{ basicInfo.creationAttitude }}</p>
        <div class="profile-card__meta">
          <span>{{ basicInfo.authorIdentityTag }}</span>
          <button type="button" @click="router.push('/basic-info')">查看资料 <ArrowRight /></button>
        </div>
      </article>

      <article class="panel latest-content">
        <div class="panel-heading">
          <div><h2>最近视频</h2><p>已收录的视频内容</p></div>
          <el-button text type="primary" @click="router.push('/videos')">查看全部</el-button>
        </div>
        <div class="video-list">
          <div v-for="(video, index) in latestVideos" :key="video.id" class="video-row">
            <span class="video-cover"><i>0{{ index + 1 }}</i><Film /></span>
            <div class="video-copy">
              <strong>{{ video.videoTitle }}</strong>
              <p>{{ video.videoIntro }}</p>
            </div>
            <span class="video-status"><i></i> 已收录</span>
          </div>
        </div>
      </article>

      <article class="panel health-card">
        <div class="panel-heading">
          <div><h2>资料完整度</h2><p>基本信息字段配置情况</p></div>
          <span class="health-score">92%</span>
        </div>
        <div class="health-ring">
          <div><strong>92</strong><span>/ 100</span></div>
        </div>
        <div class="health-items">
          <div><span>品牌基础信息</span><strong>完整</strong></div>
          <div><span>媒体资源配置</span><strong>完整</strong></div>
          <div><span>年度片单</span><strong>5 / 10</strong></div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.dashboard-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 25px;
}

.dashboard-kicker {
  color: var(--pbw-blue);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.15em;
}

.dashboard-heading h1 {
  margin: 8px 0 7px;
  color: var(--pbw-ink);
  font-size: 28px;
  font-weight: 720;
  letter-spacing: -0.03em;
}

.dashboard-heading p {
  margin: 0;
  color: var(--pbw-muted);
  font-size: 13px;
}

.dashboard-date {
  display: flex;
  height: 45px;
  align-items: center;
  gap: 9px;
  padding: 0 2px;
}

.dashboard-date > span {
  align-self: flex-start;
  margin-top: 5px;
  color: var(--pbw-blue);
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.11em;
}

.dashboard-date > strong {
  color: var(--pbw-ink);
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.08em;
}

.dashboard-date i {
  width: 1px;
  height: 32px;
  margin: 0 4px;
  background: var(--pbw-line);
}

.dashboard-date small {
  color: #8995a7;
  font-size: 10px;
  line-height: 1.55;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 19px 20px 18px;
}

.stat-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.stat-icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 10px;
}

.stat-icon :deep(svg) {
  width: 18px;
}

.stat-icon.is-blue { background: #e9f0ff; color: #346fff; }
.stat-icon.is-violet { background: #f1ebff; color: #7c4dff; }
.stat-icon.is-green { background: #e6f8f2; color: #12a87c; }
.stat-icon.is-orange { background: #fff2e4; color: #e88a2b; }

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #10a675;
  font-size: 10px;
  font-weight: 650;
}

.stat-card__label {
  display: block;
  color: #7c8799;
  font-size: 12px;
}

.stat-card > strong {
  display: block;
  margin: 7px 0 4px;
  color: var(--pbw-ink);
  font-size: 28px;
  font-weight: 710;
  letter-spacing: -0.04em;
}

.stat-card > small {
  color: #a1aaba;
  font-size: 10px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.85fr);
  gap: 16px;
  margin-top: 16px;
}

.content-overview,
.latest-content,
.health-card {
  padding: 0 20px 20px;
}

.panel-heading {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
}

.panel-heading h2 {
  margin: 0;
  color: var(--pbw-ink);
  font-size: 15px;
  font-weight: 680;
}

.panel-heading p {
  margin: 5px 0 0;
  color: var(--pbw-muted);
  font-size: 10px;
}

.content-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.content-summary-item {
  display: flex;
  min-height: 82px;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid #e8edf3;
  border-radius: 11px;
  background: #fbfcfe;
  cursor: pointer;
  text-align: left;
  transition: 0.18s ease;
}

.content-summary-item:hover {
  border-color: #cad8f9;
  background: #f6f9ff;
  transform: translateY(-1px);
}

.content-summary-item > span {
  display: grid;
  width: 38px;
  height: 38px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  background: white;
  color: #60718a;
  box-shadow: 0 3px 12px rgba(33, 50, 77, 0.07);
}

.content-summary-item > span :deep(svg) { width: 17px; }

.content-summary-item div { flex: 1; }

.content-summary-item strong {
  color: var(--pbw-ink);
  font-size: 18px;
}

.content-summary-item strong small {
  margin-left: 3px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 500;
}

.content-summary-item p {
  margin: 4px 0 0;
  color: #7c8799;
  font-size: 11px;
}

.content-summary-item > .el-icon {
  color: #b1bbca;
}

.profile-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  background: #111b2d;
  color: white;
}

.profile-card__accent {
  position: absolute;
  right: -40px;
  bottom: -70px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(52, 111, 255, 0.26), transparent 68%);
}

.profile-card__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-avatar {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 11px;
  background: rgba(255,255,255,.06);
  color: #7aa4ff;
}

.profile-avatar :deep(svg) { width: 20px; }

.profile-card__label {
  position: relative;
  display: block;
  margin-top: 27px;
  color: #5877af;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.18em;
}

.profile-card h2 {
  position: relative;
  margin: 8px 0 10px;
  font-size: 22px;
  font-weight: 650;
  letter-spacing: -0.03em;
}

.profile-card > p {
  position: relative;
  margin: 0;
  color: #8ea0ba;
  font-size: 12px;
  line-height: 1.7;
}

.profile-card__meta {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-top: 29px;
}

.profile-card__meta > span {
  color: #708198;
  font-size: 10px;
}

.profile-card__meta button {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  color: #83a9ff;
  cursor: pointer;
  font-size: 11px;
}

.profile-card__meta button svg { width: 12px; }

.video-list {
  display: grid;
}

.video-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 0;
  border-top: 1px solid var(--pbw-line);
}

.video-cover {
  position: relative;
  display: grid;
  overflow: hidden;
  width: 76px;
  height: 47px;
  flex: none;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(145deg, #dfe8f4, #f3f6fa);
  color: #8fa0b5;
}

.video-cover i {
  position: absolute;
  top: 4px;
  left: 6px;
  color: #8191a6;
  font-size: 8px;
  font-style: normal;
  font-weight: 700;
}

.video-cover :deep(svg) { width: 18px; }

.video-copy {
  min-width: 0;
  flex: 1;
}

.video-copy strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-copy p {
  overflow: hidden;
  margin: 5px 0 0;
  color: #98a2b3;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-status {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #7d899a;
  font-size: 9px;
}

.video-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #28b585;
}

.health-score {
  color: var(--pbw-blue);
  font-size: 12px;
  font-weight: 700;
}

.health-ring {
  position: relative;
  display: grid;
  width: 116px;
  height: 116px;
  margin: 3px auto 17px;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(var(--pbw-blue) 0 92%, #e9eef5 92% 100%);
}

.health-ring::before {
  position: absolute;
  width: 94px;
  height: 94px;
  border-radius: 50%;
  background: white;
  content: '';
}

.health-ring div {
  position: relative;
}

.health-ring strong {
  color: var(--pbw-ink);
  font-size: 25px;
  letter-spacing: -0.05em;
}

.health-ring span {
  color: #a2acba;
  font-size: 9px;
}

.health-items {
  display: grid;
  gap: 9px;
}

.health-items div {
  display: flex;
  justify-content: space-between;
  color: #8490a1;
  font-size: 10px;
}

.health-items strong {
  color: #526076;
  font-weight: 650;
}

@media (max-width: 1180px) {
  .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashboard-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .dashboard-date { display: none; }
  .stat-grid { grid-template-columns: 1fr; }
  .content-summary-grid { grid-template-columns: 1fr; }
}
</style>
