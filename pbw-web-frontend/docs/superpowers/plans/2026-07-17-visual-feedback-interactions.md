# 用户端视觉反馈交互实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 完成视觉伴侣提出的 8 条用户端反馈，并用组件测试、构建和浏览器复核证明交互符合要求。

**架构：** 保留 `PlaceholderModal` 作为基础浮层容器，新增视频播放与二维码联系两个业务弹窗。页面只维护当前弹窗的最小状态，二维码和视频地址继续使用现有接口；导航改用 Vue Router 精确激活类。

**技术栈：** Vue 3、TypeScript、Pinia、Vue Router、Vite、Vitest、Vue Test Utils、jsdom、Tailwind CSS

---

## 文件结构

- 创建 `vitest.config.ts` 和 `src/test/fixtures.ts`，提供测试运行环境与集中测试数据。
- 创建 `src/components/common/VideoPlayerModal.vue`、`ContactQrModal.vue` 及对应测试，统一业务浮层。
- 创建 `src/components/layout/AppNavigation.spec.ts`，修改 `AppNavigation.vue`，修复导航状态。
- 创建 `src/views/HomeView.spec.ts`，修改 `HomeView.vue`，接入播放与购买弹窗。
- 创建 `src/views/ServicesView.spec.ts`，修改 `ServicesView.vue`，接入课程报名弹窗。
- 创建 `src/views/ConsultingView.spec.ts`，修改 `ConsultingView.vue`，接入咨询弹窗并删除成功案例。
- 创建 `src/views/AboutView.spec.ts`，验证现有 `mailto:` 邮件入口。
- 修改 `package.json`、`package-lock.json`、`tsconfig.node.json`，加入测试脚本、依赖和配置检查范围。

### 任务 1：建立组件测试环境

**文件：**
- 修改：`package.json`
- 修改：`package-lock.json`
- 修改：`tsconfig.node.json`
- 创建：`vitest.config.ts`
- 创建：`src/test/fixtures.ts`

- [ ] **步骤 1：安装测试依赖**

运行：

```bash
npm install --save-dev vitest @vue/test-utils jsdom
```

预期：退出码为 `0`，依赖和锁文件同步更新。

- [ ] **步骤 2：配置测试命令与运行环境**

在 `package.json` 增加：

```json
"test": "vitest run"
```

创建 `vitest.config.ts`：

```ts
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'jsdom', clearMocks: true },
})
```

将 `tsconfig.node.json` 的 `include` 改为：

```json
"include": ["vite.config.ts", "vitest.config.ts"]
```

- [ ] **步骤 3：创建完整模型测试数据**

创建 `src/test/fixtures.ts`：

```ts
import type { BasicInfo, Course, MaterialItem, VideoItem } from '@/types/models'

export const basicInfoFixture: BasicInfo = {
  id: 1, homeCoverVideo: null, contactEmail: 'contact@example.com',
  contactQrCode: 'http://localhost/contact-qr.jpg', totalPlayCount: 100,
  totalLikeCount: 20, totalFollowerCount: 10, authorIdentityTag: '影像创作者',
  slogan: '让每一帧都有力量', creationAttitude: '持续创作', authorPhoto: null,
  editingDeskWorkPhoto: null, assetLibraryScreenshot: null, dailyMovieWatchingPhoto: null,
  annualTop10Films: [], influentialThreeDirectors: [], contactInfo: 'brandstudio011',
}
export const videoFixture: VideoItem = {
  id: 1, videoTitle: '测试视频', videoIntro: '视频介绍',
  videoUrl: 'http://localhost/test.mp4', videoCover: null,
  platformName: '测试平台', playCountText: '100',
}
export const paidMaterialFixture: MaterialItem = {
  id: 1, materialTitle: '字幕样式模板', materialPhoto: null, materialIntro: '模板介绍',
  price: 29, netdiskUrl: null, itemCount: 20, isFree: false,
  colorClass: 'bg-green-600', iconName: 'Video',
}
export const onlineCourseFixture: Course = {
  id: 1, courseName: '短视频剪辑实战课', courseTag: '实战', courseIntro: '课程介绍',
  coursePrice: 399, isOnline: true, duration: '8周', lessonCount: 32,
  features: ['实战项目练习'], colorClass: 'bg-purple-500', iconName: 'GraduationCap',
}
```

- [ ] **步骤 4：验证测试运行器并提交**

运行：

```bash
npm test -- --passWithNoTests
```

预期：Vitest 正常启动，退出码为 `0`。提交前展示上述 5 个文件的摘要，再提交：

```bash
git add package.json package-lock.json tsconfig.node.json vitest.config.ts src/test/fixtures.ts
git commit -m "test: 补充用户端组件测试环境"
```

### 任务 2：以测试驱动实现通用业务弹窗

**文件：**
- 创建：`src/components/common/VideoPlayerModal.spec.ts`
- 创建：`src/components/common/ContactQrModal.spec.ts`
- 创建：`src/components/common/VideoPlayerModal.vue`
- 创建：`src/components/common/ContactQrModal.vue`

- [ ] **步骤 1：编写失败测试**

视频弹窗测试验证 `src`、`controls`、`autoplay` 与关闭事件；二维码弹窗测试验证二维码和缺失提示：

```ts
const videoWrapper = mount(VideoPlayerModal, {
  props: { open: true, title: '测试视频', videoUrl: '/test.mp4' },
  global: { stubs: { Teleport: true } },
})
expect(videoWrapper.get('video').attributes('src')).toBe('/test.mp4')
expect(videoWrapper.get('video').attributes()).toHaveProperty('controls')
await videoWrapper.get('[aria-label="关闭"]').trigger('click')
expect(videoWrapper.emitted('close')).toHaveLength(1)

const qrWrapper = mount(ContactQrModal, {
  props: { open: true, title: '购买模板', description: '扫码询价与购买', qrCodeUrl: '/qr.jpg' },
  global: { stubs: { Teleport: true } },
})
expect(qrWrapper.get('img').attributes('src')).toBe('/qr.jpg')
expect(qrWrapper.text()).toContain('扫码询价与购买')
```

- [ ] **步骤 2：运行测试确认红灯**

```bash
npm test -- src/components/common/VideoPlayerModal.spec.ts src/components/common/ContactQrModal.spec.ts
```

预期：FAIL，两个组件尚不存在。

- [ ] **步骤 3：实现最小组件**

`VideoPlayerModal.vue`：

```vue
<script setup lang="ts">
import PlaceholderModal from './PlaceholderModal.vue'
defineProps<{ open: boolean; title: string; videoUrl: string }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <PlaceholderModal :open="open" :title="title" @close="$emit('close')">
    <video v-if="open && videoUrl" :src="videoUrl" controls autoplay playsinline class="aspect-video w-full rounded-lg bg-black" />
  </PlaceholderModal>
</template>
```

`ContactQrModal.vue`：

```vue
<script setup lang="ts">
import PlaceholderModal from './PlaceholderModal.vue'
defineProps<{ open: boolean; title: string; description: string; qrCodeUrl: string | null }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <PlaceholderModal :open="open" :title="title" @close="$emit('close')">
    <div class="space-y-4 text-center">
      <p class="text-gray-600">{{ description }}</p>
      <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="联系二维码" class="mx-auto h-64 w-64 rounded-xl bg-white object-contain p-3 shadow" />
      <p v-else class="rounded-lg bg-gray-50 p-6 text-gray-500">暂未配置联系二维码</p>
    </div>
  </PlaceholderModal>
</template>
```

- [ ] **步骤 4：验证绿灯并提交**

```bash
npm test -- src/components/common/VideoPlayerModal.spec.ts src/components/common/ContactQrModal.spec.ts
```

预期：全部 PASS。提交前展示 4 个新增文件摘要，再提交：

```bash
git add src/components/common/VideoPlayerModal.vue src/components/common/VideoPlayerModal.spec.ts src/components/common/ContactQrModal.vue src/components/common/ContactQrModal.spec.ts
git commit -m "feat: 新增视频与二维码联系弹窗"
```

### 任务 3：修复导航精确高亮

**文件：**
- 创建：`src/components/layout/AppNavigation.spec.ts`
- 修改：`src/components/layout/AppNavigation.vue`

- [ ] **步骤 1：编写失败测试**

使用 `createMemoryHistory()` 访问 `/consulting`，挂载导航后断言：

```ts
const works = wrapper.findAll('a').find((link) => link.text() === '作品展示')
const consulting = wrapper.findAll('a').find((link) => link.text() === '商业咨询')
expect(works?.classes()).not.toContain('!text-blue-600')
expect(consulting?.classes()).toContain('!text-blue-600')
```

- [ ] **步骤 2：运行测试确认当前错误**

```bash
npm test -- src/components/layout/AppNavigation.spec.ts
```

预期：FAIL，根路由仍被前缀匹配激活。

- [ ] **步骤 3：最小修复并验证**

桌面端和移动端 `RouterLink` 均将：

```vue
active-class="!font-medium !text-blue-600"
```

替换为：

```vue
exact-active-class="!font-medium !text-blue-600"
```

运行：

```bash
npm test -- src/components/layout/AppNavigation.spec.ts
```

预期：PASS。展示摘要后提交：

```bash
git add src/components/layout/AppNavigation.vue src/components/layout/AppNavigation.spec.ts
git commit -m "fix: 修复顶部导航重复高亮"
```

### 任务 4：接入首页播放和购买弹窗

**文件：**
- 创建：`src/views/HomeView.spec.ts`
- 修改：`src/views/HomeView.vue`

- [ ] **步骤 1：编写失败测试**

用 Pinia 注入测试数据并 mock `loadHome`，验证：

```ts
await wrapper.get('[aria-label="播放 测试视频"]').trigger('click')
expect(wrapper.get('video').attributes('src')).toBe('http://localhost/test.mp4')
const purchaseButton = wrapper.findAll('button').find((button) => button.text() === '立即购买')
await purchaseButton?.trigger('click')
expect(wrapper.text()).toContain('扫码联系询问价格并购买')
expect(wrapper.get('img[alt="联系二维码"]').attributes('src')).toBe('http://localhost/contact-qr.jpg')
```

- [ ] **步骤 2：运行测试确认红灯**

```bash
npm test -- src/views/HomeView.spec.ts
```

预期：FAIL，当前视频打开新窗口，购买弹窗没有二维码。

- [ ] **步骤 3：实现最小状态和接线**

新增：

```ts
const selectedVideo = ref<VideoItem | null>(null)
const selectedMaterial = ref<MaterialItem | null>(null)
const playVideo = (video: VideoItem) => { selectedVideo.value = video }
```

两个播放入口调用 `playVideo(video)`；付费素材设置 `selectedMaterial`，免费素材逻辑保持不变。页面末尾挂载：

```vue
<VideoPlayerModal :open="Boolean(selectedVideo)" :title="selectedVideo?.videoTitle || '播放视频'" :video-url="selectedVideo?.videoUrl || ''" @close="selectedVideo = null" />
<ContactQrModal :open="Boolean(selectedMaterial)" :title="selectedMaterial ? `购买 ${selectedMaterial.materialTitle}` : '购买素材'" description="扫码联系询问价格并购买" :qr-code-url="basicInfo?.contactQrCode || null" @close="selectedMaterial = null" />
```

- [ ] **步骤 4：验证并提交**

```bash
npm test -- src/views/HomeView.spec.ts
```

预期：PASS。展示摘要后提交：

```bash
git add src/views/HomeView.vue src/views/HomeView.spec.ts
git commit -m "feat: 统一首页播放与购买交互"
```

### 任务 5：接入课程报名和商业咨询弹窗

**文件：**
- 创建：`src/views/ServicesView.spec.ts`
- 创建：`src/views/ConsultingView.spec.ts`
- 修改：`src/views/ServicesView.vue`
- 修改：`src/views/ConsultingView.vue`

- [ ] **步骤 1：编写失败的课程测试**

注入上线课程和二维码后验证：

```ts
const signupButton = wrapper.findAll('button').find((button) => button.text() === '立即报名')
expect(signupButton?.attributes('disabled')).toBeUndefined()
expect(signupButton?.classes()).toContain('bg-green-600')
await signupButton?.trigger('click')
expect(wrapper.text()).toContain('联系顾问参加课程')
```

- [ ] **步骤 2：编写失败的咨询页测试**

注入基本信息并 mock `loadBasicInfo` 后验证：

```ts
expect(wrapper.text()).not.toContain('成功案例')
const consultButton = wrapper.findAll('button').find((button) => button.text().includes('立即咨询'))
await consultButton?.trigger('click')
expect(wrapper.text()).toContain('扫描二维码联系我们')
expect(wrapper.get('img[alt="联系二维码"]').attributes('src')).toBe('http://localhost/contact-qr.jpg')
```

- [ ] **步骤 3：运行测试确认红灯**

```bash
npm test -- src/views/ServicesView.spec.ts src/views/ConsultingView.spec.ts
```

预期：FAIL；课程和咨询按钮不可用，成功案例仍存在。

- [ ] **步骤 4：实现服务页报名交互**

新增 `selectedCourse`；上线课程按钮使用 `bg-green-600 hover:bg-green-700` 并设置当前课程，未上线课程保持灰色禁用；通过 `ContactQrModal` 显示“联系顾问参加课程”和 `basicInfo.contactQrCode`。

- [ ] **步骤 5：实现咨询页交互和删减**

加载 `basicInfo`；顶部“立即咨询”和全部“咨询服务”按钮设置 `consultModalOpen`；挂载二维码弹窗；删除成功案例 `<section>`；保留用户现有的“企业形象片、品牌宣传片专业剪辑制作”文案。

- [ ] **步骤 6：验证并提交**

```bash
npm test -- src/views/ServicesView.spec.ts src/views/ConsultingView.spec.ts
```

预期：全部 PASS。提交前说明 `ConsultingView.vue` 同时包含用户原有文案与本任务修改，再提交：

```bash
git add src/views/ServicesView.vue src/views/ServicesView.spec.ts src/views/ConsultingView.vue src/views/ConsultingView.spec.ts
git commit -m "feat: 完善课程报名与咨询入口"
```

### 任务 6：验证邮件入口并完成全量回归

**文件：**
- 创建：`src/views/AboutView.spec.ts`
- 检查：`src/views/AboutView.vue`

- [ ] **步骤 1：编写邮件入口回归测试**

注入 `contact@example.com` 后验证：

```ts
const emailLink = wrapper.get('a[href^="mailto:"]')
expect(emailLink.attributes('href')).toBe('mailto:contact@example.com')
expect(emailLink.text()).toContain('发送邮件')
```

- [ ] **步骤 2：运行测试**

```bash
npm test -- src/views/AboutView.spec.ts
```

预期：PASS；现有代码已正确使用 `mailto:`，不修改 `AboutView.vue`。

- [ ] **步骤 3：运行全量验证**

```bash
npm test
npm run build
git diff --check
```

预期：测试全部 PASS；构建退出码为 `0`；diff 检查无输出。

- [ ] **步骤 4：提交邮件测试**

展示仅新增测试文件的摘要后提交：

```bash
git add src/views/AboutView.spec.ts
git commit -m "test: 验证邮件联系入口"
```

- [ ] **步骤 5：通过视觉伴侣复核 8 条反馈**

在 `http://localhost:5173/` 依次确认：两个视频入口均打开播放器；所有购买入口显示二维码；上线课程按钮为绿色并显示二维码；商业咨询页只高亮当前导航；顶部及卡片咨询按钮显示二维码；成功案例不存在；邮件链接为 `mailto:`。同时检查浏览器控制台错误数为 `0`。

- [ ] **步骤 6：复核进程与工作区边界**

```bash
lsof -nP -iTCP:8080 -sTCP:LISTEN
lsof -nP -iTCP:5173 -sTCP:LISTEN
git status --short
```

预期：前后端仍监听对应端口，工作区只保留明确说明的变更。若出现后端错误，先按忽略规则获得读取 `pbw-java-backend/log/main.log` 的确认，再使用 systematic-debugging 定位。
