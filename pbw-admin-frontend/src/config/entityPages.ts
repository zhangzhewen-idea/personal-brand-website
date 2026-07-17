import type { EntityPageConfig } from '@/types/database'

export const videoPageConfig: EntityPageConfig = {
  key: 'video',
  eyebrow: 'CONTENT / VIDEO',
  title: '视频管理',
  description: '维护作品标题、介绍、封面和视频资源地址。',
  createLabel: '新建视频',
  searchPlaceholder: '搜索视频标题或介绍',
  searchFields: ['videoTitle', 'videoIntro'],
  columns: [
    { field: 'id', label: 'ID', width: 72 },
    { field: 'videoCover', label: '视频封面', width: 108, format: 'image' },
    { field: 'videoTitle', label: '视频标题', minWidth: 220 },
    { field: 'videoIntro', label: '视频介绍', minWidth: 280, format: 'multiline' },
    { field: 'videoUrl', label: '视频地址', minWidth: 220, format: 'url' },
    { field: 'createTime', label: '创建时间', width: 174, format: 'datetime' },
    { field: 'updateTime', label: '更新时间', width: 174, format: 'datetime' },
    { field: 'isDeleted', label: '数据状态', width: 104, format: 'boolean' },
  ],
}

export const materialPageConfig: EntityPageConfig = {
  key: 'material',
  eyebrow: 'CONTENT / MATERIAL',
  title: '素材库管理',
  description: '管理可交付素材的介绍、基础价格、库存、规格与网盘资源。',
  createLabel: '新建素材',
  searchPlaceholder: '搜索素材标题或介绍',
  searchFields: ['materialTitle', 'materialIntro'],
  columns: [
    { field: 'id', label: 'ID', width: 72 },
    { field: 'materialPhoto', label: '素材照片', width: 108, format: 'image' },
    { field: 'materialTitle', label: '素材标题', minWidth: 200 },
    { field: 'materialIntro', label: '素材介绍', minWidth: 280, format: 'multiline' },
    { field: 'price', label: '基础价格', width: 110, format: 'money' },
    { field: 'stock', label: '基础库存', width: 104 },
    { field: 'specifications', label: '规格', minWidth: 220, format: 'specifications' },
    { field: 'netdiskUrl', label: '网盘地址', minWidth: 220, format: 'url' },
    { field: 'createTime', label: '创建时间', width: 174, format: 'datetime' },
    { field: 'updateTime', label: '更新时间', width: 174, format: 'datetime' },
    { field: 'isDeleted', label: '数据状态', width: 104, format: 'boolean' },
  ],
}

export const matrixPageConfig: EntityPageConfig = {
  key: 'matrix',
  eyebrow: 'CHANNEL / MATRIX',
  title: '矩阵账号管理',
  description: '统一维护各内容平台的品牌账号和账号入口。',
  createLabel: '新建账号',
  searchPlaceholder: '搜索平台名称或简介',
  searchFields: ['platformName', 'intro'],
  columns: [
    { field: 'id', label: 'ID', width: 72 },
    { field: 'platformLogo', label: '平台 Logo', width: 108, format: 'image' },
    { field: 'platformName', label: '平台名称', minWidth: 150 },
    { field: 'intro', label: '简介', minWidth: 320, format: 'multiline' },
    { field: 'accountUrl', label: '账号地址', minWidth: 240, format: 'url' },
    { field: 'createTime', label: '创建时间', width: 174, format: 'datetime' },
    { field: 'updateTime', label: '更新时间', width: 174, format: 'datetime' },
    { field: 'isDeleted', label: '数据状态', width: 104, format: 'boolean' },
  ],
}

export const coursePageConfig: EntityPageConfig = {
  key: 'course',
  eyebrow: 'PRODUCT / COURSE',
  title: '课程管理',
  description: '管理课程内容、标签、价格和上线状态。',
  createLabel: '新建课程',
  searchPlaceholder: '搜索课程名称或标签',
  searchFields: ['courseName', 'courseTag'],
  columns: [
    { field: 'id', label: 'ID', width: 72 },
    { field: 'courseName', label: '课程名称', minWidth: 210 },
    { field: 'courseTag', label: '课程标签', minWidth: 190 },
    { field: 'courseIntro', label: '课程简介', minWidth: 300, format: 'multiline' },
    { field: 'coursePrice', label: '课程价格', width: 120, format: 'money' },
    { field: 'isOnline', label: '上线状态', width: 112, format: 'online' },
    { field: 'createTime', label: '创建时间', width: 174, format: 'datetime' },
    { field: 'updateTime', label: '更新时间', width: 174, format: 'datetime' },
    { field: 'isDeleted', label: '数据状态', width: 104, format: 'boolean' },
  ],
}

export const userPageConfig: EntityPageConfig = {
  key: 'user',
  eyebrow: 'SYSTEM / USER',
  title: '用户管理',
  description: '查看系统用户账号、联系信息与角色状态。',
  createLabel: '新建用户',
  searchPlaceholder: '搜索昵称、账号或邮箱',
  searchFields: ['nickname', 'account', 'email'],
  columns: [
    { field: 'id', label: 'ID', width: 72 },
    { field: 'avatar', label: '头像', width: 92, format: 'image' },
    { field: 'nickname', label: '昵称', minWidth: 150 },
    { field: 'account', label: '账号', minWidth: 150 },
    { field: 'password', label: '密码', width: 120, format: 'password' },
    { field: 'email', label: '邮箱', minWidth: 210 },
    { field: 'role', label: '角色', width: 104, format: 'role' },
    { field: 'createTime', label: '创建时间', width: 174, format: 'datetime' },
    { field: 'updateTime', label: '更新时间', width: 174, format: 'datetime' },
    { field: 'isDeleted', label: '数据状态', width: 104, format: 'boolean' },
  ],
}
