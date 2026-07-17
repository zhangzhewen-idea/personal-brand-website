<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Delete, Picture, UploadFilled, VideoCamera } from '@element-plus/icons-vue'
import { getApiErrorMessage } from '@/api/client'
import { fileApi } from '@/api/modules/files'
import { resolveMediaUrl } from '@/utils/media-url'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    mediaType: 'image' | 'video'
    hint?: string
    readonly?: boolean
  }>(),
  {
    hint: '',
    readonly: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
}>()

const previewFailed = ref(false)
const selectedFileName = ref('')
const objectUrl = ref<string | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)

const accept = computed(() => (props.mediaType === 'video' ? 'video/*' : 'image/*'))
const mediaLabel = computed(() => (props.mediaType === 'video' ? '视频' : '图片'))
const previewSource = computed(() => objectUrl.value || resolveMediaUrl(props.modelValue))
const fileName = computed(() => {
  if (selectedFileName.value) return selectedFileName.value
  if (!props.modelValue) return ''
  return props.modelValue.split('/').pop()?.split('?')[0] || `已配置${mediaLabel.value}`
})

const clearObjectUrl = () => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = null
}

const handleChange = async (file: UploadFile) => {
  if (!file.raw) return

  const expectedType = `${props.mediaType}/`
  if (!file.raw.type.startsWith(expectedType)) {
    ElMessage.error(`请选择${mediaLabel.value}文件`)
    return
  }

  const maxSize = props.mediaType === 'video' ? 100 : 10
  if (file.raw.size > maxSize * 1024 * 1024) {
    ElMessage.error(`${mediaLabel.value}大小不能超过 ${maxSize}MB`)
    return
  }

  clearObjectUrl()
  objectUrl.value = URL.createObjectURL(file.raw)
  selectedFileName.value = file.name
  previewFailed.value = false
  uploading.value = true
  uploadProgress.value = 0
  try {
    const { data } = await fileApi.upload(file.raw, props.mediaType, (percentage) => {
      uploadProgress.value = percentage
    })
    emit('update:modelValue', data.url)
    clearObjectUrl()
    ElMessage.success(`${mediaLabel.value}上传成功`)
  } catch (error) {
    clearObjectUrl()
    selectedFileName.value = ''
    ElMessage.error(getApiErrorMessage(error, `${mediaLabel.value}上传失败`))
  } finally {
    uploading.value = false
  }
}

const clearFile = () => {
  clearObjectUrl()
  selectedFileName.value = ''
  previewFailed.value = false
  emit('update:modelValue', null)
}

watch(
  () => props.modelValue,
  () => {
    previewFailed.value = false
    if (!props.modelValue) selectedFileName.value = ''
  },
)

</script>

<template>
  <div class="media-upload">
    <div v-if="previewSource" class="media-upload__preview">
      <video
        v-if="mediaType === 'video' && !previewFailed"
        :src="previewSource"
        controls
        muted
        preload="metadata"
        @error="previewFailed = true"
      />
      <img
        v-else-if="mediaType === 'image' && !previewFailed"
        :src="previewSource"
        :alt="fileName"
        @error="previewFailed = true"
      />
      <div v-else class="media-upload__fallback">
        <el-icon><component :is="mediaType === 'video' ? VideoCamera : Picture" /></el-icon>
        <span>已配置{{ mediaLabel }}</span>
      </div>
      <div class="media-upload__meta">
        <span :title="fileName">{{ fileName }}</span>
        <el-button v-if="!readonly" text circle :icon="Delete" aria-label="移除文件" @click="clearFile" />
      </div>
    </div>

    <div v-else-if="readonly" class="media-upload__empty">
      <el-icon><component :is="mediaType === 'video' ? VideoCamera : Picture" /></el-icon>
      <span>未配置{{ mediaLabel }}</span>
    </div>

    <el-upload
      v-if="!readonly"
      class="media-upload__picker"
      action="#"
      :accept="accept"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
    >
      <el-button plain :icon="UploadFilled" :loading="uploading" :disabled="uploading">
        {{ uploading ? `上传中 ${uploadProgress}%` : modelValue ? `重新选择${mediaLabel}` : `选择${mediaLabel}` }}
      </el-button>
    </el-upload>
    <p v-if="!readonly">{{ hint || (mediaType === 'video' ? '支持常见视频格式，最大 100MB' : '支持 JPG、PNG、WEBP，最大 10MB') }}</p>
  </div>
</template>

<style scoped>
.media-upload {
  width: 100%;
}

.media-upload__preview {
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid #dfe5ef;
  border-radius: 10px;
  background: #f6f8fc;
}

.media-upload__preview img,
.media-upload__preview video,
.media-upload__fallback {
  display: block;
  width: 100%;
  height: 148px;
  object-fit: cover;
}

.media-upload__fallback {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 9px;
  background: linear-gradient(145deg, #edf2ff, #f6f3ff);
  color: #7383a4;
}

.media-upload__fallback .el-icon {
  font-size: 28px;
}

.media-upload__fallback span {
  font-size: 12px;
}

.media-upload__empty {
  display: grid;
  height: 148px;
  place-items: center;
  align-content: center;
  gap: 9px;
  border: 1px dashed #d9e0eb;
  border-radius: 10px;
  background: #f8fafc;
  color: #98a2b3;
  font-size: 12px;
}

.media-upload__empty .el-icon {
  font-size: 26px;
}

.media-upload__meta {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 8px 0 12px;
  border-top: 1px solid #e7ebf2;
  color: #657189;
  font-size: 11px;
}

.media-upload__meta > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-upload__picker {
  display: inline-flex;
}

.media-upload > p {
  margin: 7px 0 0;
  color: #9aa5b5;
  font-size: 10px;
  line-height: 1.5;
}
</style>
