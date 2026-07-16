<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import MediaUpload from '@/components/MediaUpload.vue'
import type {
  EntityPageConfig,
  ManagementRecord,
  ProductSpecification,
  UserRole,
} from '@/types/database'

interface EntityFormModel {
  videoTitle: string
  videoIntro: string
  videoUrl: string | null
  videoCover: string | null
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string
  price: number
  stock: number
  specifications: ProductSpecification[]
  netdiskUrl: string
  platformName: string
  platformLogo: string | null
  accountUrl: string
  intro: string
  courseName: string
  courseTag: string
  courseIntro: string
  coursePrice: number
  isOnline: boolean
  nickname: string
  account: string
  password: string
  email: string
  avatar: string | null
  role: UserRole
}

const props = defineProps<{
  modelValue: boolean
  config: EntityPageConfig
  mode: 'create' | 'edit' | 'view'
  record: ManagementRecord | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', value: ManagementRecord): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const emptyForm = (): EntityFormModel => ({
  videoTitle: '',
  videoIntro: '',
  videoUrl: null,
  videoCover: null,
  materialTitle: '',
  materialPhoto: null,
  materialIntro: '',
  price: 0,
  stock: 0,
  specifications: [{ name: '', value: '' }],
  netdiskUrl: '',
  platformName: '',
  platformLogo: null,
  accountUrl: '',
  intro: '',
  courseName: '',
  courseTag: '',
  courseIntro: '',
  coursePrice: 0,
  isOnline: false,
  nickname: '',
  account: '',
  password: '',
  email: '',
  avatar: null,
  role: '用户',
})

const form = reactive<EntityFormModel>(emptyForm())

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const entityName = computed(() => props.config.createLabel.replace('新建', ''))
const dialogTitle = computed(() => {
  if (props.mode === 'create') return props.config.createLabel
  return `${props.mode === 'view' ? '查看' : '编辑'}${entityName.value}`
})

const rules = computed<FormRules>(() => {
  const required = (message: string) => [{ required: true, message, trigger: 'blur' }]

  switch (props.config.key) {
    case 'video':
      return {
        videoTitle: required('请输入视频标题'),
        videoUrl: required('请上传视频文件'),
      }
    case 'material':
      return {
        materialTitle: required('请输入素材标题'),
        price: required('请输入基础价格'),
        stock: required('请输入基础库存'),
      }
    case 'matrix':
      return { platformName: required('请输入平台名称') }
    case 'course':
      return {
        courseName: required('请输入课程名称'),
        coursePrice: required('请输入课程价格'),
      }
    case 'user':
      return {
        nickname: required('请输入昵称'),
        account: required('请输入账号'),
        password: required('请输入密码'),
      }
  }
})

const initializeForm = () => {
  const initial = emptyForm()
  Object.assign(form, initial, props.record || {})
  form.specifications = props.record && 'specifications' in props.record
    ? props.record.specifications.map((item) => ({ ...item }))
    : initial.specifications
  nextTick(() => formRef.value?.clearValidate())
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) initializeForm()
  },
)

const addSpecification = () => {
  form.specifications.push({ name: '', value: '' })
}

const removeSpecification = (index: number) => {
  form.specifications.splice(index, 1)
  if (!form.specifications.length) addSpecification()
}

const asNullable = (value: string | null) => value || null

const buildRecord = (): ManagementRecord => {
  const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
  const base = {
    id: props.record?.id || 0,
    createTime: props.record?.createTime || now,
    updateTime: now,
    isDeleted: props.record?.isDeleted || false,
  }

  switch (props.config.key) {
    case 'video':
      return {
        ...base,
        videoTitle: form.videoTitle.trim(),
        videoIntro: asNullable(form.videoIntro.trim()),
        videoUrl: form.videoUrl || '',
        videoCover: form.videoCover,
      }
    case 'material':
      return {
        ...base,
        materialTitle: form.materialTitle.trim(),
        materialPhoto: form.materialPhoto,
        materialIntro: asNullable(form.materialIntro.trim()),
        price: Number(form.price),
        stock: Number(form.stock),
        specifications: form.specifications
          .filter((item) => item.name.trim() && item.value.trim())
          .map((item) => ({ name: item.name.trim(), value: item.value.trim() })),
        netdiskUrl: asNullable(form.netdiskUrl.trim()),
      }
    case 'matrix':
      return {
        ...base,
        platformName: form.platformName.trim(),
        platformLogo: form.platformLogo,
        accountUrl: asNullable(form.accountUrl.trim()),
        intro: asNullable(form.intro.trim()),
      }
    case 'course':
      return {
        ...base,
        courseName: form.courseName.trim(),
        courseTag: asNullable(form.courseTag.trim()),
        courseIntro: asNullable(form.courseIntro.trim()),
        coursePrice: Number(form.coursePrice),
        isOnline: form.isOnline,
      }
    case 'user':
      return {
        ...base,
        nickname: form.nickname.trim(),
        account: form.account.trim(),
        password: form.password,
        email: asNullable(form.email.trim()),
        avatar: form.avatar,
        role: form.role,
      }
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (
    props.config.key === 'material' &&
    form.specifications.some((item) => Boolean(item.name.trim()) !== Boolean(item.value.trim()))
  ) {
    ElMessage.warning('每条规格都需要同时填写规格名称和规格值')
    return
  }

  submitting.value = true
  emit('submit', buildRecord())
  submitting.value = false
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    class="pbw-form-dialog"
    :title="dialogTitle"
    width="min(760px, calc(100vw - 32px))"
    destroy-on-close
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :disabled="mode === 'view'"
      label-position="top"
    >
      <template v-if="config.key === 'video'">
        <div class="form-grid">
          <el-form-item class="is-wide" label="视频标题" prop="videoTitle">
            <el-input v-model="form.videoTitle" maxlength="255" show-word-limit placeholder="请输入视频标题" />
          </el-form-item>
          <el-form-item class="is-wide" label="视频介绍" prop="videoIntro">
            <el-input v-model="form.videoIntro" type="textarea" :rows="3" placeholder="请输入视频介绍" />
          </el-form-item>
          <el-form-item label="视频文件" prop="videoUrl">
            <MediaUpload v-model="form.videoUrl" media-type="video" :readonly="mode === 'view'" />
          </el-form-item>
          <el-form-item label="视频封面" prop="videoCover">
            <MediaUpload v-model="form.videoCover" media-type="image" :readonly="mode === 'view'" />
          </el-form-item>
        </div>
      </template>

      <template v-else-if="config.key === 'material'">
        <div class="form-grid">
          <el-form-item class="is-wide" label="素材标题" prop="materialTitle">
            <el-input v-model="form.materialTitle" maxlength="255" show-word-limit placeholder="请输入素材标题" />
          </el-form-item>
          <el-form-item class="is-wide" label="素材介绍" prop="materialIntro">
            <el-input v-model="form.materialIntro" type="textarea" :rows="3" placeholder="请输入素材介绍" />
          </el-form-item>
          <el-form-item label="基础价格" prop="price">
            <el-input-number v-model="form.price" :min="0" :precision="2" :step="1" controls-position="right" />
          </el-form-item>
          <el-form-item label="基础库存" prop="stock">
            <el-input-number v-model="form.stock" :min="0" :precision="0" :step="1" controls-position="right" />
          </el-form-item>
          <el-form-item label="素材图片" prop="materialPhoto">
            <MediaUpload v-model="form.materialPhoto" media-type="image" :readonly="mode === 'view'" />
          </el-form-item>
          <el-form-item label="网盘地址" prop="netdiskUrl">
            <el-input v-model="form.netdiskUrl" placeholder="https://" />
          </el-form-item>
        </div>

        <section class="specification-editor">
          <div class="specification-editor__heading">
            <div>
              <strong>商品规格</strong>
              <p>规格只包含名称和值，统一共享上方的基础价格和基础库存。</p>
            </div>
            <el-button v-if="mode !== 'view'" plain :icon="Plus" @click="addSpecification">添加规格</el-button>
          </div>
          <div class="specification-list">
            <div
              v-for="(item, index) in form.specifications"
              :key="index"
              class="specification-row"
              :class="{ 'is-readonly': mode === 'view' }"
            >
              <el-input v-model="item.name" placeholder="规格名称，如：颜色" />
              <el-input v-model="item.value" placeholder="规格值，如：红色" />
              <el-button
                v-if="mode !== 'view'"
                text
                circle
                type="danger"
                :icon="Delete"
                aria-label="移除规格"
                @click="removeSpecification(index)"
              />
            </div>
          </div>
        </section>
      </template>

      <template v-else-if="config.key === 'matrix'">
        <div class="form-grid">
          <el-form-item label="平台名称" prop="platformName">
            <el-input v-model="form.platformName" placeholder="请输入平台名称" />
          </el-form-item>
          <el-form-item label="账号地址" prop="accountUrl">
            <el-input v-model="form.accountUrl" placeholder="https://" />
          </el-form-item>
          <el-form-item label="平台 Logo" prop="platformLogo">
            <MediaUpload v-model="form.platformLogo" media-type="image" :readonly="mode === 'view'" />
          </el-form-item>
          <el-form-item label="简介" prop="intro">
            <el-input v-model="form.intro" type="textarea" :rows="6" placeholder="请输入平台简介" />
          </el-form-item>
        </div>
      </template>

      <template v-else-if="config.key === 'course'">
        <div class="form-grid">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="form.courseName" placeholder="请输入课程名称" />
          </el-form-item>
          <el-form-item label="课程标签" prop="courseTag">
            <el-input v-model="form.courseTag" placeholder="如：剪辑 / 解说 / 表达" />
          </el-form-item>
          <el-form-item class="is-wide" label="课程简介" prop="courseIntro">
            <el-input v-model="form.courseIntro" type="textarea" :rows="4" placeholder="请输入课程简介" />
          </el-form-item>
          <el-form-item label="课程价格" prop="coursePrice">
            <el-input-number v-model="form.coursePrice" :min="0" :precision="2" controls-position="right" />
          </el-form-item>
          <el-form-item label="上线状态" prop="isOnline">
            <el-switch v-model="form.isOnline" inline-prompt active-text="已上线" inactive-text="待上线" />
          </el-form-item>
        </div>
      </template>

      <template v-else-if="config.key === 'user'">
        <div class="form-grid">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入登录账号" />
          </el-form-item>
          <el-form-item v-if="mode !== 'view'" label="密码" prop="password">
            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item v-else label="密码">
            <el-input model-value="••••••••" disabled />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" type="email" placeholder="name@example.com" />
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <MediaUpload v-model="form.avatar" media-type="image" :readonly="mode === 'view'" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="form.role">
              <el-radio-button value="用户">用户</el-radio-button>
              <el-radio-button value="管理员">管理员</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
      </template>
    </el-form>

    <template #footer>
      <el-button v-if="mode === 'view'" type="primary" @click="visible = false">关闭</el-button>
      <template v-else>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ mode === 'create' ? '确认新增' : '保存修改' }}
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.form-grid .is-wide {
  grid-column: 1 / -1;
}

.form-grid :deep(.el-input-number) {
  width: 100%;
}

.specification-editor {
  margin-top: 5px;
  padding-top: 20px;
  border-top: 1px solid #e8ecf3;
}

.specification-editor__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 13px;
}

.specification-editor__heading strong {
  color: #344054;
  font-size: 13px;
}

.specification-editor__heading p {
  margin: 4px 0 0;
  color: #98a2b3;
  font-size: 11px;
}

.specification-list {
  display: grid;
  gap: 9px;
}

.specification-row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) 34px;
  gap: 9px;
}

.specification-row.is-readonly {
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid .is-wide {
    grid-column: auto;
  }

  .specification-editor__heading {
    align-items: stretch;
    flex-direction: column;
  }

  .specification-row {
    grid-template-columns: 1fr 1fr 34px;
  }
}
</style>
