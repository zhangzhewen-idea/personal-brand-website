<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Delete,
  DocumentCopy,
  Link,
  MoreFilled,
  Picture,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import EntityFormDialog from '@/components/EntityFormDialog.vue'
import PageHeading from '@/components/PageHeading.vue'
import { getApiErrorMessage } from '@/api/client'
import { entityApis } from '@/api/modules/entities'
import type { PageQuery, PageResult } from '@/api/modules/crud'
import type {
  EntityFormSubmission,
  EntityPageConfig,
  ManagementRecord,
  ProductSpecification,
} from '@/types/database'
import { cloneData } from '@/utils/cloneData'

const props = defineProps<{
  config: EntityPageConfig
}>()

const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rows = ref<ManagementRecord[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit' | 'view'>('create')
const editingRecord = ref<ManagementRecord | null>(null)
const failedImages = ref(new Set<string>())
const saving = ref(false)

interface EntityApi {
  getPage(params: PageQuery): Promise<{ data: PageResult<ManagementRecord> }>
  getDetail(id: number): Promise<{ data: ManagementRecord }>
  create(data: Record<string, unknown>): Promise<unknown>
  update(id: number, data: Record<string, unknown>): Promise<unknown>
  remove(id: number): Promise<unknown>
  duplicate(id: number): Promise<unknown>
}

const api = entityApis[props.config.key] as unknown as EntityApi

const loadRows = async () => {
  loading.value = true
  try {
    const { data } = await api.getPage({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value.trim() || undefined,
      status: 'normal',
      sortBy: 'createTime',
      sortOrder: 'desc',
    })
    rows.value = data.list as ManagementRecord[]
    total.value = data.total
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '加载数据失败'))
  } finally {
    loading.value = false
  }
}

const getValue = (row: ManagementRecord, field: string) =>
  (row as unknown as Record<string, unknown>)[field]

const imageSource = (value: unknown) => typeof value === 'string' ? value : ''
const isImageAvailable = (value: unknown) => {
  const source = imageSource(value)
  return Boolean(source) && !failedImages.value.has(source)
}
const handleImageError = (value: unknown) => {
  const source = imageSource(value)
  if (!source) return
  failedImages.value = new Set([...failedImages.value, source])
}

const resetFilters = () => {
  keyword.value = ''
  currentPage.value = 1
}

const openUrl = (value: unknown) => {
  if (typeof value === 'string' && value) window.open(value, '_blank', 'noopener,noreferrer')
}

const getSpecifications = (value: unknown): ProductSpecification[] =>
  Array.isArray(value) ? (value as ProductSpecification[]) : []

const openCreateDialog = () => {
  dialogMode.value = 'create'
  editingRecord.value = null
  dialogVisible.value = true
}

const openRecordDialog = async (mode: 'view' | 'edit', row: ManagementRecord) => {
  loading.value = true
  try {
    const { data } = await api.getDetail(row.id)
    dialogMode.value = mode
    editingRecord.value = cloneData(data as ManagementRecord)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '加载详情失败'))
  } finally {
    loading.value = false
  }
}

const openViewDialog = (row: ManagementRecord) => void openRecordDialog('view', row)
const openEditDialog = (row: ManagementRecord) => void openRecordDialog('edit', row)

const toPayload = (record: EntityFormSubmission) => {
  const payload = { ...record } as Record<string, unknown>
  for (const field of ['id', 'createTime', 'updateTime', 'isDeleted', 'passwordConfigured']) {
    delete payload[field]
  }
  if (props.config.key === 'user' && dialogMode.value === 'edit' && !payload.password) {
    delete payload.password
  }
  return payload
}

const saveRecord = async (record: EntityFormSubmission) => {
  if (saving.value) return
  saving.value = true
  try {
    if (dialogMode.value === 'create') {
      await api.create(toPayload(record))
      ElMessage.success(`${props.config.createLabel}成功`)
    } else {
      await api.update(record.id, toPayload(record))
      ElMessage.success('修改已保存')
    }
    dialogVisible.value = false
    await loadRows()
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, dialogMode.value === 'create' ? '新增失败' : '更新失败'))
  } finally {
    saving.value = false
  }
}

const duplicateRecord = async (row: ManagementRecord) => {
  try {
    await api.duplicate(row.id)
    ElMessage.success('记录已复制')
    currentPage.value = 1
    await loadRows()
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '复制失败'))
  }
}

const deleteRecord = async (row: ManagementRecord) => {
  try {
    await ElMessageBox.confirm(
      '删除后该记录将不再显示，且无法从管理页面恢复。',
      '确认删除记录',
      {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
      },
    )
  } catch {
    return
  }

  try {
    await api.remove(row.id)
    ElMessage.success('记录已删除')
    await loadRows()
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '删除失败'))
  }
}

interface RowCommand {
  action: 'duplicate' | 'delete'
  row: ManagementRecord
}

const handleRowCommand = (command: RowCommand) => {
  if (command.action === 'duplicate') {
    void duplicateRecord(command.row)
    return
  }
  void deleteRecord(command.row)
}

const shortUrl = (value: unknown) => {
  const url = String(value || '')
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

let searchTimer: number | undefined
watch(keyword, () => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    currentPage.value = 1
    void loadRows()
  }, 300)
})
watch(pageSize, () => {
  currentPage.value = 1
  void loadRows()
})
watch(currentPage, () => void loadRows())

onMounted(() => void loadRows())
</script>

<template>
  <section>
    <PageHeading
      :eyebrow="config.eyebrow"
      :title="config.title"
      :description="config.description"
    >
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">
        {{ config.createLabel }}
      </el-button>
    </PageHeading>

    <div class="panel table-panel">
      <div class="table-toolbar">
        <div class="table-toolbar__filters">
          <el-input
            v-model="keyword"
            class="search-input"
            :prefix-icon="Search"
            :placeholder="config.searchPlaceholder"
            clearable
          />
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </div>
        <span class="record-count">共 {{ total }} 条记录</span>
      </div>

      <el-table v-loading="loading" :data="rows" row-key="id" class="management-table">
        <el-table-column
          v-for="column in config.columns"
          :key="column.field"
          :prop="column.field"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div v-if="column.format === 'image'" class="media-cell">
              <span class="media-cell__preview" :class="{ 'is-empty': !isImageAvailable(getValue(row, column.field)) }">
                <img
                  v-if="isImageAvailable(getValue(row, column.field))"
                  :src="imageSource(getValue(row, column.field))"
                  :alt="column.label"
                  @error="handleImageError(getValue(row, column.field))"
                />
                <el-icon v-else><Picture /></el-icon>
              </span>
            </div>
            <el-link
              v-else-if="column.format === 'url'"
              class="url-cell"
              underline="never"
              type="primary"
              @click="openUrl(getValue(row, column.field))"
            >
              <el-icon><Link /></el-icon>
              <span>{{ shortUrl(getValue(row, column.field)) }}</span>
            </el-link>
            <span v-else-if="column.format === 'money'" class="money-cell">
              ¥ {{ Number(getValue(row, column.field)).toFixed(2) }}
            </span>
            <div v-else-if="column.format === 'specifications'" class="specification-cell">
              <el-tag
                v-for="item in getSpecifications(getValue(row, column.field))"
                :key="`${item.name}-${item.value}`"
                effect="plain"
                round
              >
                {{ item.name }}：{{ item.value }}
              </el-tag>
              <span v-if="!getSpecifications(getValue(row, column.field)).length">—</span>
            </div>
            <el-tag
              v-else-if="column.format === 'boolean'"
              :type="getValue(row, column.field) ? 'info' : 'success'"
              effect="light"
              round
            >
              {{ getValue(row, column.field) ? '已删除' : '正常' }}
            </el-tag>
            <el-tag
              v-else-if="column.format === 'online'"
              :type="getValue(row, column.field) ? 'success' : 'warning'"
              effect="light"
              round
            >
              {{ getValue(row, column.field) ? '已上线' : '待上线' }}
            </el-tag>
            <el-tag
              v-else-if="column.format === 'role'"
              :type="getValue(row, column.field) === '管理员' ? 'primary' : 'info'"
              effect="light"
              round
            >
              {{ getValue(row, column.field) }}
            </el-tag>
            <span v-else-if="column.format === 'password'" class="password-cell">
              {{ getValue(row, column.field) ? '已配置' : '未配置' }}
            </span>
            <span v-else :class="{ 'multiline-cell': column.format === 'multiline' }">
              {{ getValue(row, column.field) ?? '—' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="154">
          <template #default="{ row }">
            <div class="row-actions">
              <el-button link type="primary" @click="openViewDialog(row)">查看</el-button>
              <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
              <el-dropdown trigger="click" @command="handleRowCommand">
                <el-button circle text :icon="MoreFilled" aria-label="更多操作" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'duplicate', row }" :icon="DocumentCopy">
                      复制记录
                    </el-dropdown-item>
                    <el-dropdown-item
                      divided
                      :command="{ action: 'delete', row }"
                      :icon="Delete"
                    >
                      删除记录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>数据来自后端实时接口</span>
        <el-pagination
          v-model:current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
        />
      </div>
    </div>

    <EntityFormDialog
      v-model="dialogVisible"
      :config="config"
      :mode="dialogMode"
      :record="editingRecord"
      :submitting="saving"
      @submit="saveRecord"
    />
  </section>
</template>

<style scoped>
.table-panel {
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--pbw-line);
}

.table-toolbar__filters {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 292px;
}

.record-count {
  flex: none;
  color: var(--pbw-muted);
  font-size: 13px;
}

.management-table {
  width: 100%;
}

.media-cell {
  display: inline-flex;
  align-items: center;
}

.media-cell__preview {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid #dce4ee;
  border-radius: 10px;
  background: linear-gradient(145deg, #eef3f9, #f8fafc);
  color: #718096;
  font-size: 17px;
}

.media-cell__preview img { width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }

.media-cell__preview.is-empty {
  border-style: dashed;
  background: #f8fafc;
  color: #b5beca;
}

.url-cell {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 5px;
}

.url-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.money-cell {
  color: var(--pbw-ink);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}

.specification-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.password-cell {
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.multiline-cell {
  color: #596579;
  line-height: 1.55;
}

.row-actions {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.table-footer {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 20px;
  border-top: 1px solid var(--pbw-line);
  color: var(--pbw-muted);
  font-size: 12px;
}

@media (max-width: 860px) {
  .table-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .table-toolbar__filters {
    width: 100%;
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
  }

  .table-footer > span {
    display: none;
  }

  .table-footer {
    justify-content: flex-end;
  }
}
</style>
