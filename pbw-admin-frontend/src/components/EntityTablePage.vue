<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Delete,
  DocumentCopy,
  Link,
  MoreFilled,
  Picture,
  Plus,
  Refresh,
  RefreshLeft,
  Search,
} from '@element-plus/icons-vue'
import EntityFormDialog from '@/components/EntityFormDialog.vue'
import PageHeading from '@/components/PageHeading.vue'
import type { EntityPageConfig, ManagementRecord, ProductSpecification } from '@/types/database'
import { cloneData } from '@/utils/cloneData'

const props = defineProps<{
  config: EntityPageConfig
}>()

const keyword = ref('')
const status = ref('all')
const pageSize = ref(10)
const rows = ref<ManagementRecord[]>(props.config.rows.map((row) => cloneData(row)))
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit' | 'view'>('create')
const editingRecord = ref<ManagementRecord | null>(null)

const getValue = (row: ManagementRecord, field: string) =>
  (row as unknown as Record<string, unknown>)[field]

const filteredRows = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()
  return rows.value.filter((row) => {
    const matchesKeyword =
      !normalizedKeyword ||
      props.config.searchFields.some((field) =>
        String(getValue(row, field) ?? '')
          .toLowerCase()
          .includes(normalizedKeyword),
      )
    const deleted = Boolean(getValue(row, 'isDeleted'))
    const matchesStatus =
      status.value === 'all' ||
      (status.value === 'normal' && !deleted) ||
      (status.value === 'deleted' && deleted)
    return matchesKeyword && matchesStatus
  })
})

const resetFilters = () => {
  keyword.value = ''
  status.value = 'all'
}

const prototypeNotice = () => {
  ElMessage.info('当前为前端原型，详情与更多操作将在后端接口接入后开放')
}

const getSpecifications = (value: unknown): ProductSpecification[] =>
  Array.isArray(value) ? (value as ProductSpecification[]) : []

const openCreateDialog = () => {
  dialogMode.value = 'create'
  editingRecord.value = null
  dialogVisible.value = true
}

const openViewDialog = (row: ManagementRecord) => {
  dialogMode.value = 'view'
  editingRecord.value = cloneData(row)
  dialogVisible.value = true
}

const openEditDialog = (row: ManagementRecord) => {
  dialogMode.value = 'edit'
  editingRecord.value = cloneData(row)
  dialogVisible.value = true
}

const saveRecord = (record: ManagementRecord) => {
  if (dialogMode.value === 'create') {
    const nextId = Math.max(0, ...rows.value.map((item) => item.id)) + 1
    rows.value.unshift({ ...record, id: nextId } as ManagementRecord)
    ElMessage.success(`${props.config.createLabel}成功`)
    return
  }

  const index = rows.value.findIndex((item) => item.id === record.id)
  if (index >= 0) rows.value.splice(index, 1, record)
  ElMessage.success('修改已保存')
}

const formatNow = () =>
  new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')

const duplicateRecord = (row: ManagementRecord) => {
  const nextId = Math.max(0, ...rows.value.map((item) => item.id)) + 1
  const copied = cloneData(row)
  const nameFields: Record<EntityPageConfig['key'], string> = {
    video: 'videoTitle',
    material: 'materialTitle',
    matrix: 'platformName',
    course: 'courseName',
    user: 'nickname',
  }
  const nameField = nameFields[props.config.key]
  const recordData = copied as unknown as Record<string, unknown>
  recordData[nameField] = `${String(recordData[nameField] || '')}（副本）`

  if (props.config.key === 'user') {
    recordData.account = `${String(recordData.account || 'user')}_copy_${nextId}`
    if (recordData.email) recordData.email = null
  }

  copied.id = nextId
  copied.createTime = formatNow()
  copied.updateTime = copied.createTime
  copied.isDeleted = false
  rows.value.unshift(copied)
  ElMessage.success('记录已复制')
}

const toggleDeleted = async (row: ManagementRecord) => {
  if (!row.isDeleted) {
    try {
      await ElMessageBox.confirm(
        '该记录将标记为已删除，可通过状态筛选后恢复。',
        '确认标记删除',
        {
          type: 'warning',
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
        },
      )
    } catch {
      return
    }
  }

  const index = rows.value.findIndex((item) => item.id === row.id)
  if (index < 0) return
  rows.value.splice(index, 1, {
    ...row,
    isDeleted: !row.isDeleted,
    updateTime: formatNow(),
  } as ManagementRecord)
  ElMessage.success(row.isDeleted ? '记录已恢复' : '记录已标记删除')
}

interface RowCommand {
  action: 'duplicate' | 'toggleDeleted'
  row: ManagementRecord
}

const handleRowCommand = (command: RowCommand) => {
  if (command.action === 'duplicate') {
    duplicateRecord(command.row)
    return
  }
  void toggleDeleted(command.row)
}

const shortUrl = (value: unknown) => {
  const url = String(value || '')
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
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
          <el-select v-model="status" class="status-select" aria-label="数据状态">
            <el-option label="全部状态" value="all" />
            <el-option label="正常数据" value="normal" />
            <el-option label="已删除" value="deleted" />
          </el-select>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </div>
        <span class="record-count">共 {{ filteredRows.length }} 条记录</span>
      </div>

      <el-table :data="filteredRows" row-key="id" class="management-table">
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
              <span class="media-cell__preview" :class="{ 'is-empty': !getValue(row, column.field) }">
                <el-icon><Picture /></el-icon>
              </span>
              <el-tooltip :content="String(getValue(row, column.field) || '未设置')" placement="top">
                <span class="media-cell__label">
                  {{ getValue(row, column.field) ? '已配置' : '未配置' }}
                </span>
              </el-tooltip>
            </div>
            <el-link
              v-else-if="column.format === 'url'"
              class="url-cell"
              underline="never"
              type="primary"
              @click="prototypeNotice"
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
            <span v-else-if="column.format === 'password'" class="password-cell">••••••••</span>
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
                      :command="{ action: 'toggleDeleted', row }"
                      :icon="row.isDeleted ? RefreshLeft : Delete"
                    >
                      {{ row.isDeleted ? '恢复记录' : '标记删除' }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>数据来自 database.sql 示例记录</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredRows.length"
          :page-size="pageSize"
        />
      </div>
    </div>

    <EntityFormDialog
      v-model="dialogVisible"
      :config="config"
      :mode="dialogMode"
      :record="editingRecord"
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

.status-select {
  width: 132px;
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
  gap: 9px;
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

.media-cell__label {
  color: var(--pbw-muted);
  font-size: 12px;
}

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
