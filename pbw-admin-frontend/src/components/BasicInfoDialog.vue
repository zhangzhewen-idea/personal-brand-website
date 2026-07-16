<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import MediaUpload from '@/components/MediaUpload.vue'
import type { BasicInfo } from '@/types/database'
import { cloneData } from '@/utils/cloneData'

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  record: BasicInfo | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', value: BasicInfo): void
}>()

const emptyForm = (): BasicInfo => ({
  id: 0,
  homeCoverVideo: null,
  contactEmail: null,
  contactQrCode: null,
  totalPlayCount: 0,
  totalLikeCount: 0,
  totalFollowerCount: 0,
  authorIdentityTag: null,
  slogan: null,
  creationAttitude: null,
  authorPhoto: null,
  editingDeskWorkPhoto: null,
  assetLibraryScreenshot: null,
  dailyMovieWatchingPhoto: null,
  annualTop10Films: [],
  influentialThreeDirectors: [],
  contactInfo: null,
  createTime: '',
  updateTime: '',
  isDeleted: false,
})

const formRef = ref<FormInstance>()
const submitting = ref(false)
const form = reactive<BasicInfo>(emptyForm())
const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const rules: FormRules = {
  authorIdentityTag: [{ required: true, message: '请输入作者身份标签', trigger: 'blur' }],
  slogan: [{ required: true, message: '请输入 Slogan', trigger: 'blur' }],
  homeCoverVideo: [{ required: true, message: '请上传首页封面视频', trigger: 'change' }],
}

const initializeForm = () => {
  const source = props.record ? cloneData(props.record) : emptyForm()
  Object.assign(form, source)
  form.annualTop10Films = [...source.annualTop10Films]
  form.influentialThreeDirectors = [...source.influentialThreeDirectors]
  nextTick(() => formRef.value?.clearValidate())
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) initializeForm()
  },
)

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
  emit('submit', {
    ...cloneData(form),
    createTime: form.createTime || now,
    updateTime: now,
  })
  submitting.value = false
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    class="pbw-form-dialog"
    :title="mode === 'create' ? '新增基本信息' : '编辑基本信息'"
    width="min(920px, calc(100vw - 32px))"
    destroy-on-close
    append-to-body
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <section class="dialog-section">
        <div class="dialog-section__heading">
          <strong>品牌与联系信息</strong>
          <span>填写对外展示的核心资料</span>
        </div>
        <div class="basic-form-grid">
          <el-form-item label="作者身份标签" prop="authorIdentityTag">
            <el-input v-model="form.authorIdentityTag" placeholder="如：电影解说创作者 / 剪辑师" />
          </el-form-item>
          <el-form-item label="Slogan" prop="slogan">
            <el-input v-model="form.slogan" placeholder="请输入品牌 Slogan" />
          </el-form-item>
          <el-form-item class="is-wide" label="创作态度" prop="creationAttitude">
            <el-input v-model="form.creationAttitude" type="textarea" :rows="3" placeholder="请输入创作态度" />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="contactEmail">
            <el-input v-model="form.contactEmail" type="email" placeholder="name@example.com" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contactInfo">
            <el-input v-model="form.contactInfo" placeholder="如：微信 brandstudio01" />
          </el-form-item>
        </div>
      </section>

      <section class="dialog-section">
        <div class="dialog-section__heading">
          <strong>核心数据</strong>
          <span>展示品牌当前累计数据</span>
        </div>
        <div class="metric-form-grid">
          <el-form-item label="全网播放量" prop="totalPlayCount">
            <el-input-number v-model="form.totalPlayCount" :min="0" :precision="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="全网点赞数" prop="totalLikeCount">
            <el-input-number v-model="form.totalLikeCount" :min="0" :precision="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="全网粉丝数" prop="totalFollowerCount">
            <el-input-number v-model="form.totalFollowerCount" :min="0" :precision="0" controls-position="right" />
          </el-form-item>
        </div>
      </section>

      <section class="dialog-section">
        <div class="dialog-section__heading">
          <strong>内容偏好</strong>
          <span>输入内容后按回车创建标签</span>
        </div>
        <div class="basic-form-grid">
          <el-form-item label="年度十佳影片" prop="annualTop10Films">
            <el-select
              v-model="form.annualTop10Films"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="输入影片名称后按回车"
            />
          </el-form-item>
          <el-form-item label="影响我的三位导演" prop="influentialThreeDirectors">
            <el-select
              v-model="form.influentialThreeDirectors"
              multiple
              filterable
              allow-create
              default-first-option
              :multiple-limit="3"
              placeholder="输入导演姓名后按回车"
            />
          </el-form-item>
        </div>
      </section>

      <section class="dialog-section">
        <div class="dialog-section__heading">
          <strong>媒体资源</strong>
          <span>视频使用视频上传组件，其余字段使用图片上传组件</span>
        </div>
        <div class="media-form-grid">
          <el-form-item label="首页封面视频" prop="homeCoverVideo">
            <MediaUpload v-model="form.homeCoverVideo" media-type="video" />
          </el-form-item>
          <el-form-item label="联系二维码" prop="contactQrCode">
            <MediaUpload v-model="form.contactQrCode" media-type="image" hint="建议上传正方形二维码图片" />
          </el-form-item>
          <el-form-item label="作者照片" prop="authorPhoto">
            <MediaUpload v-model="form.authorPhoto" media-type="image" />
          </el-form-item>
          <el-form-item label="剪辑台工作照" prop="editingDeskWorkPhoto">
            <MediaUpload v-model="form.editingDeskWorkPhoto" media-type="image" />
          </el-form-item>
          <el-form-item label="素材库截图" prop="assetLibraryScreenshot">
            <MediaUpload v-model="form.assetLibraryScreenshot" media-type="image" />
          </el-form-item>
          <el-form-item label="观影日常照片" prop="dailyMovieWatchingPhoto">
            <MediaUpload v-model="form.dailyMovieWatchingPhoto" media-type="image" />
          </el-form-item>
        </div>
      </section>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        {{ mode === 'create' ? '确认新增' : '保存修改' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-section + .dialog-section {
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid #e8ecf3;
}

.dialog-section__heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
}

.dialog-section__heading strong {
  color: #344054;
  font-size: 13px;
}

.dialog-section__heading span {
  color: #98a2b3;
  font-size: 10px;
}

.basic-form-grid,
.metric-form-grid,
.media-form-grid {
  display: grid;
  gap: 0 18px;
}

.basic-form-grid,
.media-form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.metric-form-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.is-wide {
  grid-column: 1 / -1;
}

.metric-form-grid :deep(.el-input-number),
.basic-form-grid :deep(.el-select) {
  width: 100%;
}

@media (max-width: 700px) {
  .basic-form-grid,
  .metric-form-grid,
  .media-form-grid {
    grid-template-columns: 1fr;
  }

  .is-wide {
    grid-column: auto;
  }
}
</style>
