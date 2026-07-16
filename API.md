# PBW 接口文档

> 文档版本：v1.0
>
> 最后更新：2026-07-17
>
> 适用前端：`pbw-admin-frontend`
>
> 当前范围：管理员端接口；用户端接口将在本文档后续章节补充

## 1. 文档说明

本文档依据 `pbw-admin-frontend/src/views`、通用表格与表单组件、TypeScript 类型、模拟数据及 `database.sql` 设计。管理员端覆盖以下功能：

- 管理员登录与会话；
- 工作台数据概览；
- 基本信息管理；
- 视频管理；
- 素材库管理；
- 矩阵账号管理；
- 课程管理；
- 用户管理；
- 图片、视频资源上传；
- 通用分页、搜索、查看、新增、编辑、复制、逻辑删除和恢复。

### 1.1 路径规范

- 管理员端资源统一位于 `/api/admin/{resource}`；
- 用户端资源统一位于 `/api/user/{resource}`；
- 资源名使用小写 kebab-case，集合资源优先使用复数名词；
- 路径不使用 `page`、`detail`、`create`、`update`、`delete`、`restore` 等操作动词，操作语义由 HTTP Method 表达；
- 请求参数和返回参数一律使用 camelCase；
- 本文档中的 `{id}` 为资源标识路径参数，不属于 JSON 字段命名范围。

示例：

```text
GET    /api/admin/videos
GET    /api/admin/videos/{id}
POST   /api/admin/videos
PUT    /api/admin/videos/{id}
DELETE /api/admin/videos/{id}
PATCH  /api/admin/videos/{id}
POST   /api/admin/videos/{id}/copies
```

RESTful 方法语义：集合查询和单项查询使用 `GET`，创建资源使用 `POST`，完整替换使用 `PUT`，部分状态变更使用 `PATCH`，删除使用 `DELETE`。复制操作建模为 `copies` 子资源，不在路径中使用动词。

- `GET` 为安全、幂等操作，不得产生业务状态变更；
- `PUT` 提交完整可写资源，重复执行结果一致；
- `PATCH` 只提交需要变更的字段，本文档中用于恢复逻辑删除状态；
- `DELETE` 执行逻辑删除并保持幂等；
- `POST` 创建成功时返回 `201 Created`，并通过 `Location` 响应头给出新资源地址。

### 1.2 基础地址与请求格式

```text
开发环境：http://localhost:8080
接口前缀：/api
字符编码：UTF-8
默认请求类型：application/json
上传请求类型：multipart/form-data
```

除登录和密码重置接口外，管理员端请求必须携带访问令牌：

```http
Authorization: Bearer <accessToken>
```

新增、复制等可能因网络重试而重复执行的接口，建议携带标准请求头：

```http
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

同一管理员、同一路径、同一 `Idempotency-Key` 在 24 小时内必须返回同一业务结果，不得重复创建记录。

### 1.3 HTTP 响应状态码约定

为与当前 Axios 调用方式保持一致，成功响应直接返回业务数据，不额外包裹 `code/data/message`；错误响应统一采用 1.4 定义的 `application/problem+json`。HTTP 状态码表达执行结果：

| 场景 | HTTP 状态码 | 响应体 |
| --- | ---: | --- |
| 请求成功 | `200 OK` | 业务对象 |
| 资源创建成功 | `201 Created` | 新建后的业务对象 |
| 删除成功 | `204 No Content` | 无 |
| 请求格式或参数错误 | `400 Bad Request` | Problem Details 错误对象 |
| 未认证或令牌失效 | `401 Unauthorized` | Problem Details 错误对象 |
| 无访问权限 | `403 Forbidden` | Problem Details 错误对象 |
| 资源不存在 | `404 Not Found` | Problem Details 错误对象 |
| 服务端异常 | `500 Internal Server Error` | Problem Details 错误对象 |

其他业务状态码见 1.4 错误响应约定。

创建资源示例响应头：

```http
HTTP/1.1 201 Created
Location: /api/admin/videos/4
Content-Type: application/json
```

分页响应统一为：

```json
{
  "list": [],
  "total": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
```

### 1.4 错误响应约定

错误响应采用 `application/problem+json`：

```json
{
  "type": "https://pbw.example.com/problems/validation-error",
  "title": "请求参数校验失败",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "存在 1 个不合法字段",
  "instance": "/api/admin/videos",
  "requestId": "req_01J2ABCDEF",
  "fieldErrors": [
    {
      "field": "videoTitle",
      "message": "视频标题不能为空"
    }
  ]
}
```

常用错误码：

| HTTP 状态码 | `code` | 使用场景 |
| ---: | --- | --- |
| 400 | `BAD_REQUEST` | JSON 格式、路径参数或查询参数不合法 |
| 401 | `UNAUTHORIZED` | 未登录、令牌无效或令牌过期 |
| 403 | `FORBIDDEN` | 当前账号不是管理员或无操作权限 |
| 404 | `RESOURCE_NOT_FOUND` | 记录不存在 |
| 409 | `RESOURCE_CONFLICT` | 账号、邮箱等唯一字段冲突 |
| 409 | `RESOURCE_DELETED` | 对已逻辑删除记录执行不允许的操作 |
| 413 | `FILE_TOO_LARGE` | 上传文件超过限制 |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | 文件类型不支持 |
| 422 | `VALIDATION_ERROR` | 业务字段校验失败 |
| 429 | `TOO_MANY_REQUESTS` | 请求频率过高 |
| 500 | `INTERNAL_ERROR` | 未预期的服务端错误 |

### 1.5 数据类型与业务约定

- 时间统一返回 ISO 8601 格式，例如 `2026-07-17T09:30:00+08:00`；
- `id` 按前端原型返回 JSON number，服务端生成值不得超过 JavaScript 安全整数 `9007199254740991`；
- 金额使用 JSON number，最多两位小数，币种默认为人民币；
- 可空字段没有值时返回 `null`，不返回空字符串；
- `isDeleted`、`isOnline` 使用 JSON boolean；
- 逻辑删除不物理移除数据；删除后可在“已删除”筛选中查询并恢复；
- 创建时间、更新时间和删除标记由服务端维护，创建和完整更新请求不得接收 `createTime`、`updateTime`、`isDeleted`；恢复接口的 `PATCH` 请求仅允许提交 `isDeleted=false`；
- 列表默认按 `createTime desc, id desc` 排序；
- 所有文本字段入库前去除首尾空白；URL 仅允许 `https`，本地开发环境可额外允许 `http://localhost`；
- 密码只允许出现在写请求中，任何查询响应、日志和错误详情均不得返回明文密码或密码散列。

### 1.6 通用分页参数

视频、素材、矩阵账号、课程、用户的分页接口使用相同查询参数：

| 参数 | 位置 | 类型 | 必填 | 默认值 | 约束与说明 |
| --- | --- | --- | --- | --- | --- |
| `page` | query | integer | 否 | `1` | 最小值 `1` |
| `pageSize` | query | integer | 否 | `10` | `1-100` |
| `keyword` | query | string | 否 | - | 去除首尾空白，最长 100 字符；搜索字段由各模块定义 |
| `status` | query | string | 否 | `all` | `all`、`normal`、`deleted` |
| `sortBy` | query | string | 否 | `createTime` | 仅允许模块声明的白名单字段 |
| `sortOrder` | query | string | 否 | `desc` | `asc`、`desc` |

### 1.7 通用基础字段

所有管理实体的返回对象均包含：

| 字段 | 类型 | 必有 | 说明 |
| --- | --- | --- | --- |
| `id` | integer | 是 | 记录 ID |
| `createTime` | string(datetime) | 是 | 创建时间 |
| `updateTime` | string(datetime) | 是 | 最后更新时间 |
| `isDeleted` | boolean | 是 | 是否已逻辑删除 |

## 2. 接口总览

| 模块 | 接口 | Method | Path |
| --- | --- | --- | --- |
| 认证 | 创建、获取、删除当前会话 | POST、GET、DELETE | `/api/admin/session` |
| 认证 | 创建密码重置申请 | POST | `/api/admin/password-reset-requests` |
| 认证 | 执行密码重置 | POST | `/api/admin/password-resets` |
| 工作台 | 获取工作台概览 | GET | `/api/admin/dashboard` |
| 基本信息 | 获取、新增基本信息 | GET、POST | `/api/admin/basic-info` |
| 基本信息 | 更新基本信息 | PUT | `/api/admin/basic-info/{id}` |
| 文件 | 上传媒体文件 | POST | `/api/admin/files` |
| 视频 | 分页查询、新增 | GET、POST | `/api/admin/videos` |
| 视频 | 详情、更新、删除、恢复 | GET、PUT、DELETE、PATCH | `/api/admin/videos/{id}` |
| 视频 | 复制 | POST | `/api/admin/videos/{id}/copies` |
| 素材 | 分页查询、新增 | GET、POST | `/api/admin/materials` |
| 素材 | 详情、更新、删除、恢复 | GET、PUT、DELETE、PATCH | `/api/admin/materials/{id}` |
| 素材 | 复制 | POST | `/api/admin/materials/{id}/copies` |
| 矩阵账号 | 分页查询、新增 | GET、POST | `/api/admin/matrix-accounts` |
| 矩阵账号 | 详情、更新、删除、恢复 | GET、PUT、DELETE、PATCH | `/api/admin/matrix-accounts/{id}` |
| 矩阵账号 | 复制 | POST | `/api/admin/matrix-accounts/{id}/copies` |
| 课程 | 分页查询、新增 | GET、POST | `/api/admin/courses` |
| 课程 | 详情、更新、删除、恢复 | GET、PUT、DELETE、PATCH | `/api/admin/courses/{id}` |
| 课程 | 复制 | POST | `/api/admin/courses/{id}/copies` |
| 用户 | 分页查询、新增 | GET、POST | `/api/admin/users` |
| 用户 | 详情、更新、删除、恢复 | GET、PUT、DELETE、PATCH | `/api/admin/users/{id}` |
| 用户 | 复制 | POST | `/api/admin/users/{id}/copies` |

## 3. 认证模块

### 3.1 管理员登录

- 接口名称：管理员登录
- 接口功能：校验管理员账号密码并创建后台访问会话。
- 请求方式：`POST`
- 访问路径：`/api/admin/session`
- 是否鉴权：否
- 限流建议：同一账号和 IP 每分钟最多 5 次失败尝试。

请求参数：

| 参数 | 位置 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `account` | body | string | 是 | 1-255 字符 | 管理员登录账号 |
| `password` | body | string | 是 | 6-72 字符 | 登录密码 |

使用示例：

```http
POST /api/admin/session HTTP/1.1
Content-Type: application/json

{
  "account": "admin",
  "password": "123456"
}
```

返回数据：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `token` | string | Bearer 访问令牌；字段名与当前前端登录类型一致 |
| `expiresIn` | integer | 访问令牌有效秒数 |
| `nickname` | string | 当前管理员昵称 |
| `role` | string | 固定为 `管理员` |

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiJ9.example",
  "expiresIn": 7200,
  "nickname": "管理员",
  "role": "管理员"
}
```

前端的 `remember` 字段只决定令牌保存在持久存储还是会话存储，不发送给服务端。

### 3.2 获取当前管理员

- 接口名称：获取当前管理员
- 接口功能：页面刷新后恢复管理员展示信息，并验证令牌是否仍有效。
- 请求方式：`GET`
- 访问路径：`/api/admin/session`
- 是否鉴权：是

请求参数：无。

使用示例：

```http
GET /api/admin/session HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：当前管理员对象。

```json
{
  "id": 1,
  "nickname": "管理员",
  "account": "admin",
  "email": "admin@example.com",
  "avatar": "https://cdn.example.com/avatars/admin.jpg",
  "role": "管理员"
}
```

### 3.3 管理员退出

- 接口名称：管理员退出
- 接口功能：使当前访问令牌失效并结束会话。
- 请求方式：`DELETE`
- 访问路径：`/api/admin/session`
- 是否鉴权：是

请求参数：无。

使用示例：

```http
DELETE /api/admin/session HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：成功时返回 `204 No Content`，无响应体。重复退出保持幂等。

### 3.4 申请重置密码

- 接口名称：申请重置密码
- 接口功能：对应登录页“忘记密码”，向管理员已验证的邮箱发送一次性重置链接。
- 请求方式：`POST`
- 访问路径：`/api/admin/password-reset-requests`
- 是否鉴权：否

请求参数：

| 参数 | 位置 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `accountOrEmail` | body | string | 是 | 1-255 字符 | 管理员账号或邮箱 |

使用示例：

```http
POST /api/admin/password-reset-requests HTTP/1.1
Content-Type: application/json

{
  "accountOrEmail": "admin@example.com"
}
```

返回数据：无论账号是否存在都返回相同结果，防止枚举管理员账号。

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "accepted": true,
  "expiresIn": 900
}
```

### 3.5 确认重置密码

- 接口名称：确认重置密码
- 接口功能：使用邮件中的一次性令牌设置新密码，并使该管理员的全部旧会话失效。
- 请求方式：`POST`
- 访问路径：`/api/admin/password-resets`
- 是否鉴权：否

请求参数：

| 参数 | 位置 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `resetToken` | body | string | 是 | 一次性且有效期 15 分钟 | 密码重置令牌 |
| `newPassword` | body | string | 是 | 8-72 字符，至少包含字母和数字 | 新密码 |

使用示例：

```http
POST /api/admin/password-resets HTTP/1.1
Content-Type: application/json

{
  "resetToken": "prt_01J2ABCDEF",
  "newPassword": "NewPbwPass2026"
}
```

返回数据：

```json
{
  "success": true
}
```

## 4. 工作台模块

### 4.1 获取工作台概览

- 接口名称：获取工作台概览
- 接口功能：一次返回工作台所需的品牌指标、课程统计、内容资产数量、最近视频、品牌摘要和资料完整度，避免首页发起多次串行请求。
- 请求方式：`GET`
- 访问路径：`/api/admin/dashboard`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `trendDays` | query | integer | 否 | `30` | 趋势对比周期，允许 `7`、`30`、`90` |
| `latestVideoLimit` | query | integer | 否 | `3` | 最近视频条数，范围 `1-10` |

使用示例：

```http
GET /api/admin/dashboard?trendDays=30&latestVideoLimit=3 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `serverTime` | string(datetime) | 服务端当前时间，前端据此展示日期 |
| `adminNickname` | string | 欢迎语中的管理员昵称 |
| `metrics` | array | 顶部指标卡片 |
| `metrics[].key` | string | `totalPlayCount`、`totalLikeCount`、`totalFollowerCount`、`onlineCourseCount` |
| `metrics[].value` | number | 指标原始值，格式化由前端完成 |
| `metrics[].trendRate` | number \| null | 相对上一个周期的百分比；无法计算时为 `null` |
| `metrics[].trendDirection` | string | `up`、`down`、`flat` |
| `metrics[].caption` | string | 指标说明 |
| `contentSummary` | object | 视频、素材、矩阵账号、用户数量 |
| `courseSummary` | object | 课程上线数量和总数 |
| `latestVideos` | array | 最近创建的正常视频，字段见视频对象 |
| `profileSummary` | object \| null | 品牌资料摘要；尚未配置时为 `null` |
| `profileCompleteness` | object | 资料完整度 |

```json
{
  "serverTime": "2026-07-17T09:30:00+08:00",
  "adminNickname": "管理员",
  "metrics": [
    {
      "key": "totalPlayCount",
      "value": 12800000,
      "trendRate": 18.6,
      "trendDirection": "up",
      "caption": "内容持续被看见"
    },
    {
      "key": "totalLikeCount",
      "value": 860000,
      "trendRate": 9.2,
      "trendDirection": "up",
      "caption": "互动表现稳定"
    },
    {
      "key": "totalFollowerCount",
      "value": 240000,
      "trendRate": 6.8,
      "trendDirection": "up",
      "caption": "账号矩阵共计"
    },
    {
      "key": "onlineCourseCount",
      "value": 2,
      "trendRate": null,
      "trendDirection": "flat",
      "caption": "共 3 门课程"
    }
  ],
  "contentSummary": {
    "videoCount": 3,
    "materialCount": 3,
    "matrixAccountCount": 3,
    "userCount": 3
  },
  "courseSummary": {
    "onlineCount": 2,
    "totalCount": 3,
    "onlineRate": 66.67
  },
  "latestVideos": [
    {
      "id": 3,
      "videoTitle": "我最常用的剪辑节奏模板",
      "videoIntro": "分享节奏控制、转场和音效搭配的常用方法。",
      "videoCover": "https://cdn.example.com/covers/video-cover-3.jpg",
      "createTime": "2026-07-16T21:00:00+08:00"
    }
  ],
  "profileSummary": {
    "authorIdentityTag": "电影解说创作者 / 剪辑师",
    "slogan": "用镜头拆解故事",
    "creationAttitude": "先理解，再表达；先克制，再准确。"
  },
  "profileCompleteness": {
    "score": 92,
    "brandBasicInfoComplete": true,
    "mediaResourcesComplete": true,
    "annualTop10FilmCount": 5,
    "annualTop10FilmTarget": 10
  }
}
```

统计口径：除非单独说明，数量和最近内容均只统计 `isDeleted=false` 的记录。趋势数据若暂时没有历史快照，必须返回 `null`，不得用硬编码百分比冒充真实统计。

## 5. 基本信息模块

### 5.1 基本信息对象

| 字段 | 类型 | 可空 | 写入约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | integer | 否 | 只读 | ID |
| `homeCoverVideo` | string | 否 | HTTPS URL，最长 500 | 首页封面视频 |
| `contactEmail` | string | 是 | 合法邮箱，最长 255 | 联系邮箱 |
| `contactQrCode` | string | 是 | HTTPS URL，最长 500 | 联系二维码 |
| `totalPlayCount` | integer | 否 | `>= 0` | 全网播放量 |
| `totalLikeCount` | integer | 否 | `>= 0` | 全网点赞数 |
| `totalFollowerCount` | integer | 否 | `>= 0` | 全网粉丝数 |
| `authorIdentityTag` | string | 否 | 1-255 字符 | 作者身份标签 |
| `slogan` | string | 否 | 1-255 字符 | 品牌 Slogan |
| `creationAttitude` | string | 是 | 最长 5000 字符 | 创作态度 |
| `authorPhoto` | string | 是 | HTTPS URL，最长 500 | 作者照片 |
| `editingDeskWorkPhoto` | string | 是 | HTTPS URL，最长 500 | 剪辑台工作照 |
| `assetLibraryScreenshot` | string | 是 | HTTPS URL，最长 500 | 素材库截图 |
| `dailyMovieWatchingPhoto` | string | 是 | HTTPS URL，最长 500 | 观影日常照片 |
| `annualTop10Films` | string[] | 否 | 最多 10 项，每项 1-255 字符 | 年度十佳影片 |
| `influentialThreeDirectors` | string[] | 否 | 最多 3 项，每项 1-255 字符 | 影响我的三位导演 |
| `contactInfo` | string | 是 | 最长 500 字符 | 其他联系方式 |
| `createTime` | string(datetime) | 否 | 只读 | 创建时间 |
| `updateTime` | string(datetime) | 否 | 只读 | 更新时间 |
| `isDeleted` | boolean | 否 | 只读 | 删除标记 |

基本信息在管理端按“当前品牌资料”使用。允许新增的原因是原型提供“新增基本信息”按钮；每次创建的新记录自动成为当前记录，历史记录保留但不参与当前展示。

### 5.2 获取当前基本信息

- 接口名称：获取当前基本信息
- 接口功能：获取最新创建且未删除的品牌基本信息。
- 请求方式：`GET`
- 访问路径：`/api/admin/basic-info`
- 是否鉴权：是
- 请求参数：无

使用示例：

```http
GET /api/admin/basic-info HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：基本信息对象；尚未创建时返回 `404 RESOURCE_NOT_FOUND`。

```json
{
  "id": 1,
  "homeCoverVideo": "https://cdn.example.com/videos/home-cover-1.mp4",
  "contactEmail": "contact@example.com",
  "contactQrCode": "https://cdn.example.com/qrcode/contact-qr-1.png",
  "totalPlayCount": 12800000,
  "totalLikeCount": 860000,
  "totalFollowerCount": 240000,
  "authorIdentityTag": "电影解说创作者 / 剪辑师",
  "slogan": "用镜头拆解故事",
  "creationAttitude": "先理解，再表达；先克制，再准确。",
  "authorPhoto": "https://cdn.example.com/images/author-photo-1.jpg",
  "editingDeskWorkPhoto": "https://cdn.example.com/images/editing-desk-1.jpg",
  "assetLibraryScreenshot": "https://cdn.example.com/images/asset-library-1.jpg",
  "dailyMovieWatchingPhoto": "https://cdn.example.com/images/daily-movie-1.jpg",
  "annualTop10Films": ["《奥本海默》", "《爱乐之城》"],
  "influentialThreeDirectors": ["希区柯克", "诺兰", "是枝裕和"],
  "contactInfo": "微信：brandstudio01",
  "createTime": "2026-07-16T21:00:00+08:00",
  "updateTime": "2026-07-16T21:00:00+08:00",
  "isDeleted": false
}
```

### 5.3 新增基本信息

- 接口名称：新增基本信息
- 接口功能：创建一套新的品牌基本信息，并将其设为当前记录。
- 请求方式：`POST`
- 访问路径：`/api/admin/basic-info`
- 是否鉴权：是

请求参数：请求体包含 5.1 中除 `id`、`createTime`、`updateTime`、`isDeleted` 外的全部字段；必填规则以 5.1 为准。

使用示例：

```http
POST /api/admin/basic-info HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: 57fd3ef6-c757-43f1-b922-80924a668212
Content-Type: application/json

{
  "homeCoverVideo": "https://cdn.example.com/videos/home-cover-2.mp4",
  "contactEmail": "contact@example.com",
  "contactQrCode": null,
  "totalPlayCount": 12800000,
  "totalLikeCount": 860000,
  "totalFollowerCount": 240000,
  "authorIdentityTag": "电影解说创作者 / 剪辑师",
  "slogan": "用镜头拆解故事",
  "creationAttitude": "先理解，再表达；先克制，再准确。",
  "authorPhoto": null,
  "editingDeskWorkPhoto": null,
  "assetLibraryScreenshot": null,
  "dailyMovieWatchingPhoto": null,
  "annualTop10Films": ["《奥本海默》"],
  "influentialThreeDirectors": ["诺兰"],
  "contactInfo": "微信：brandstudio01"
}
```

返回数据：`201 Created` 和创建后的完整基本信息对象，格式同 5.2。

### 5.4 更新基本信息

- 接口名称：更新基本信息
- 接口功能：完整更新指定品牌基本信息。
- 请求方式：`PUT`
- 访问路径：`/api/admin/basic-info/{id}`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | integer | 是 | 基本信息 ID |
| 业务字段 | body | object | 是 | 与 5.3 相同；`PUT` 必须传完整可写对象 |

使用示例：

```http
PUT /api/admin/basic-info/1 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "homeCoverVideo": "https://cdn.example.com/videos/home-cover-1.mp4",
  "contactEmail": "new-contact@example.com",
  "contactQrCode": "https://cdn.example.com/qrcode/contact-qr-1.png",
  "totalPlayCount": 12900000,
  "totalLikeCount": 870000,
  "totalFollowerCount": 245000,
  "authorIdentityTag": "电影解说创作者 / 剪辑师",
  "slogan": "用镜头拆解故事",
  "creationAttitude": "先理解，再表达；先克制，再准确。",
  "authorPhoto": "https://cdn.example.com/images/author-photo-1.jpg",
  "editingDeskWorkPhoto": null,
  "assetLibraryScreenshot": null,
  "dailyMovieWatchingPhoto": null,
  "annualTop10Films": ["《奥本海默》", "《寄生虫》"],
  "influentialThreeDirectors": ["希区柯克", "诺兰", "是枝裕和"],
  "contactInfo": "微信：brandstudio01"
}
```

返回数据：`200 OK` 和更新后的完整基本信息对象，格式同 5.2。

## 6. 文件模块

### 6.1 上传媒体文件

- 接口名称：上传媒体文件
- 接口功能：上传管理端表单中的图片或视频，并返回可持久化访问的资源 URL。
- 请求方式：`POST`
- 访问路径：`/api/admin/files`
- 是否鉴权：是
- 请求类型：`multipart/form-data`

请求参数：

| 参数 | 位置 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `file` | form-data | binary | 是 | 图片最大 10MB；视频最大 100MB | 文件内容 |
| `mediaType` | form-data | string | 是 | `image`、`video` | 媒体类型 |

支持格式：

- 图片：`image/jpeg`、`image/png`、`image/webp`；
- 视频：`video/mp4`、`video/webm`、`video/quicktime`；
- 服务端必须同时校验扩展名、MIME 和文件特征，不得只信任客户端声明。

使用示例：

```bash
curl -X POST 'http://localhost:8080/api/admin/files' \
  -H 'Authorization: Bearer <accessToken>' \
  -H 'Idempotency-Key: ffd69085-2e41-42d2-8328-0ef41128a2dc' \
  -F 'mediaType=image' \
  -F 'file=@/path/to/cover.webp'
```

返回数据：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fileKey` | string | 存储系统中的稳定文件标识 |
| `url` | string | 表单写入数据库的资源 URL |
| `originalName` | string | 原始文件名 |
| `contentType` | string | 服务端识别的 MIME |
| `fileSize` | integer | 字节数 |
| `mediaType` | string | `image` 或 `video` |

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "fileKey": "images/2026/07/01J2COVER.webp",
  "url": "https://cdn.example.com/images/2026/07/01J2COVER.webp",
  "originalName": "cover.webp",
  "contentType": "image/webp",
  "fileSize": 248312,
  "mediaType": "image"
}
```

上传成功后，前端应把 `url` 写入对应业务接口字段；不能把浏览器生成的 `blob:` URL 提交给业务接口。

## 7. 视频管理模块

### 7.1 视频对象

| 字段 | 类型 | 可空 | 写入约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | integer | 否 | 只读 | 视频 ID |
| `videoTitle` | string | 否 | 1-255 字符 | 视频标题 |
| `videoIntro` | string | 是 | 最长 5000 字符 | 视频介绍 |
| `videoUrl` | string | 否 | HTTPS URL，最长 1000 | 视频资源地址 |
| `videoCover` | string | 是 | HTTPS URL，最长 500 | 视频封面地址 |
| `createTime` | string(datetime) | 否 | 只读 | 创建时间 |
| `updateTime` | string(datetime) | 否 | 只读 | 更新时间 |
| `isDeleted` | boolean | 否 | 只读 | 删除标记 |

分页搜索字段：`videoTitle`、`videoIntro`。排序白名单：`id`、`videoTitle`、`createTime`、`updateTime`。

### 7.2 分页查询视频

- 接口名称：分页查询视频
- 接口功能：按关键字和数据状态查询视频列表，供视频管理表格使用。
- 请求方式：`GET`
- 访问路径：`/api/admin/videos`
- 是否鉴权：是
- 请求参数：见 1.6 通用分页参数。

使用示例：

```http
GET /api/admin/videos?page=1&pageSize=10&keyword=电影&status=normal&sortBy=createTime&sortOrder=desc HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：分页对象，`list` 元素为 7.1 视频对象。

```json
{
  "list": [
    {
      "id": 1,
      "videoTitle": "为什么这部电影能封神",
      "videoIntro": "从叙事结构、镜头语言和人物动机三个角度拆解。",
      "videoUrl": "https://cdn.example.com/videos/video-1.mp4",
      "videoCover": "https://cdn.example.com/covers/video-cover-1.jpg",
      "createTime": "2026-07-16T21:00:00+08:00",
      "updateTime": "2026-07-16T21:00:00+08:00",
      "isDeleted": false
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 7.3 获取视频详情

- 接口名称：获取视频详情
- 接口功能：获取查看或编辑弹窗所需的完整视频数据。
- 请求方式：`GET`
- 访问路径：`/api/admin/videos/{id}`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | integer | 是 | 视频 ID |

使用示例：

```http
GET /api/admin/videos/1 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：7.1 视频对象，示例与 7.2 的 `list[0]` 相同。详情接口允许读取已逻辑删除记录，以支持“已删除”筛选后的查看操作。

### 7.4 新增视频

- 接口名称：新增视频
- 接口功能：新增一条视频记录。
- 请求方式：`POST`
- 访问路径：`/api/admin/videos`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `videoTitle` | body | string | 是 | 视频标题 |
| `videoIntro` | body | string \| null | 否 | 视频介绍 |
| `videoUrl` | body | string | 是 | 上传接口返回的视频 URL |
| `videoCover` | body | string \| null | 否 | 上传接口返回的图片 URL |

使用示例：

```http
POST /api/admin/videos HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: 41b5af9e-5465-4fd1-984a-2ffbcbcc1899
Content-Type: application/json

{
  "videoTitle": "如何建立镜头节奏",
  "videoIntro": "从景别、时长和声音三个维度讲解。",
  "videoUrl": "https://cdn.example.com/videos/video-4.mp4",
  "videoCover": "https://cdn.example.com/covers/video-cover-4.jpg"
}
```

返回数据：`201 Created` 和新建后的 7.1 视频对象。

```json
{
  "id": 4,
  "videoTitle": "如何建立镜头节奏",
  "videoIntro": "从景别、时长和声音三个维度讲解。",
  "videoUrl": "https://cdn.example.com/videos/video-4.mp4",
  "videoCover": "https://cdn.example.com/covers/video-cover-4.jpg",
  "createTime": "2026-07-17T10:00:00+08:00",
  "updateTime": "2026-07-17T10:00:00+08:00",
  "isDeleted": false
}
```

### 7.5 更新视频

- 接口名称：更新视频
- 接口功能：完整更新指定视频的标题、介绍和媒体资源。
- 请求方式：`PUT`
- 访问路径：`/api/admin/videos/{id}`
- 是否鉴权：是

请求参数：`id` 为必填 path integer；body 参数与 7.4 相同，`PUT` 必须提交完整可写对象。

使用示例：

```http
PUT /api/admin/videos/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "videoTitle": "如何建立镜头节奏（完整版）",
  "videoIntro": "从景别、时长、声音和情绪四个维度讲解。",
  "videoUrl": "https://cdn.example.com/videos/video-4.mp4",
  "videoCover": "https://cdn.example.com/covers/video-cover-4-v2.jpg"
}
```

返回数据：`200 OK` 和更新后的 7.1 视频对象。

### 7.6 复制视频

- 接口名称：复制视频
- 接口功能：复制指定视频，标题自动追加 `（副本）`，新记录的 `isDeleted` 固定为 `false`。
- 请求方式：`POST`
- 访问路径：`/api/admin/videos/{id}/copies`
- 是否鉴权：是

请求参数：`id` 为必填 path integer；无请求体。已删除视频也允许复制，复制结果为正常记录。

使用示例：

```http
POST /api/admin/videos/1/copies HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: b3039e68-4b16-4234-aea6-3d64d5e1d3c2
```

返回数据：`201 Created` 和复制后的 7.1 视频对象。

```json
{
  "id": 5,
  "videoTitle": "为什么这部电影能封神（副本）",
  "videoIntro": "从叙事结构、镜头语言和人物动机三个角度拆解。",
  "videoUrl": "https://cdn.example.com/videos/video-1.mp4",
  "videoCover": "https://cdn.example.com/covers/video-cover-1.jpg",
  "createTime": "2026-07-17T10:10:00+08:00",
  "updateTime": "2026-07-17T10:10:00+08:00",
  "isDeleted": false
}
```

### 7.7 逻辑删除视频

- 接口名称：逻辑删除视频
- 接口功能：将视频标记为已删除，供状态筛选和后续恢复。
- 请求方式：`DELETE`
- 访问路径：`/api/admin/videos/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
DELETE /api/admin/videos/5 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：成功时返回 `204 No Content`，无响应体；重复删除同一记录保持幂等并继续返回 `204`。

### 7.8 恢复视频

- 接口名称：恢复视频
- 接口功能：将已删除视频恢复为正常状态。
- 请求方式：`PATCH`
- 访问路径：`/api/admin/videos/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；body 仅允许 `isDeleted=false`。

使用示例：

```http
PATCH /api/admin/videos/5 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "isDeleted": false
}
```

返回数据：`200 OK` 和恢复后的 7.1 视频对象，其中 `isDeleted=false`；重复恢复保持幂等。

## 8. 素材库管理模块

### 8.1 素材对象

| 字段 | 类型 | 可空 | 写入约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | integer | 否 | 只读 | 素材 ID |
| `materialTitle` | string | 否 | 1-255 字符 | 素材标题 |
| `materialPhoto` | string | 是 | HTTPS URL，最长 500 | 素材图片 |
| `materialIntro` | string | 是 | 最长 5000 字符 | 素材介绍 |
| `price` | number | 否 | `0-99999999.99`，两位小数 | 基础价格 |
| `stock` | integer | 否 | `0-2147483647` | 基础库存 |
| `specifications` | object[] | 否 | 最多 50 项 | 商品规格 |
| `specifications[].name` | string | 否 | 1-100 字符 | 规格名称 |
| `specifications[].value` | string | 否 | 1-255 字符 | 规格值 |
| `netdiskUrl` | string | 是 | HTTPS URL，最长 1000 | 网盘地址 |
| `createTime` | string(datetime) | 否 | 只读 | 创建时间 |
| `updateTime` | string(datetime) | 否 | 只读 | 更新时间 |
| `isDeleted` | boolean | 否 | 只读 | 删除标记 |

分页搜索字段：`materialTitle`、`materialIntro`。排序白名单：`id`、`materialTitle`、`price`、`stock`、`createTime`、`updateTime`。

`specifications` 中每一项必须同时提供 `name` 和 `value`；空数组合法。所有规格共享素材的基础价格和基础库存，与原型一致。

### 8.2 分页查询素材

- 接口名称：分页查询素材
- 接口功能：按关键字和数据状态查询素材列表。
- 请求方式：`GET`
- 访问路径：`/api/admin/materials`
- 是否鉴权：是
- 请求参数：见 1.6 通用分页参数。

使用示例：

```http
GET /api/admin/materials?page=1&pageSize=10&keyword=模板&status=all HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：分页对象，`list` 元素为 8.1 素材对象。

```json
{
  "list": [
    {
      "id": 3,
      "materialTitle": "字幕样式模板",
      "materialPhoto": "https://cdn.example.com/materials/subtitle-pack.jpg",
      "materialIntro": "适合打造统一视觉风格的片头字幕与重点标注。",
      "price": 29.0,
      "stock": 200,
      "specifications": [
        { "name": "版本", "value": "通用版" }
      ],
      "netdiskUrl": "https://pan.example.com/s/ijkl9012",
      "createTime": "2026-07-16T21:00:00+08:00",
      "updateTime": "2026-07-16T21:00:00+08:00",
      "isDeleted": false
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 8.3 获取素材详情

- 接口名称：获取素材详情
- 接口功能：获取查看或编辑弹窗所需的完整素材数据。
- 请求方式：`GET`
- 访问路径：`/api/admin/materials/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer。

使用示例：

```http
GET /api/admin/materials/3 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：8.1 素材对象，示例与 8.2 的 `list[0]` 相同；允许读取已逻辑删除记录。

### 8.4 新增素材

- 接口名称：新增素材
- 接口功能：新增一条可交付素材记录。
- 请求方式：`POST`
- 访问路径：`/api/admin/materials`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `materialTitle` | body | string | 是 | 素材标题 |
| `materialPhoto` | body | string \| null | 否 | 素材图片 URL |
| `materialIntro` | body | string \| null | 否 | 素材介绍 |
| `price` | body | number | 是 | 基础价格 |
| `stock` | body | integer | 是 | 基础库存 |
| `specifications` | body | object[] | 是 | 规格数组，可为空数组 |
| `netdiskUrl` | body | string \| null | 否 | 网盘地址 |

使用示例：

```http
POST /api/admin/materials HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: d37d80a2-ad04-4382-b431-12206f1c0f79
Content-Type: application/json

{
  "materialTitle": "电影调色预设包",
  "materialPhoto": "https://cdn.example.com/materials/lut-pack.jpg",
  "materialIntro": "适用于常见电影感调色场景。",
  "price": 49.9,
  "stock": 100,
  "specifications": [
    { "name": "格式", "value": "Cube" },
    { "name": "版本", "value": "V1" }
  ],
  "netdiskUrl": "https://pan.example.com/s/lut123"
}
```

返回数据：`201 Created` 和新建后的 8.1 素材对象。

```json
{
  "id": 4,
  "materialTitle": "电影调色预设包",
  "materialPhoto": "https://cdn.example.com/materials/lut-pack.jpg",
  "materialIntro": "适用于常见电影感调色场景。",
  "price": 49.9,
  "stock": 100,
  "specifications": [
    { "name": "格式", "value": "Cube" },
    { "name": "版本", "value": "V1" }
  ],
  "netdiskUrl": "https://pan.example.com/s/lut123",
  "createTime": "2026-07-17T10:30:00+08:00",
  "updateTime": "2026-07-17T10:30:00+08:00",
  "isDeleted": false
}
```

### 8.5 更新素材

- 接口名称：更新素材
- 接口功能：完整更新指定素材的介绍、价格、库存、规格和资源地址。
- 请求方式：`PUT`
- 访问路径：`/api/admin/materials/{id}`
- 是否鉴权：是

请求参数：`id` 为必填 path integer；body 参数与 8.4 相同，必须提交完整可写对象。

使用示例：

```http
PUT /api/admin/materials/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "materialTitle": "电影调色预设包 V2",
  "materialPhoto": "https://cdn.example.com/materials/lut-pack-v2.jpg",
  "materialIntro": "新增夜景和室内场景预设。",
  "price": 59.0,
  "stock": 120,
  "specifications": [
    { "name": "格式", "value": "Cube" },
    { "name": "版本", "value": "V2" }
  ],
  "netdiskUrl": "https://pan.example.com/s/lut456"
}
```

返回数据：`200 OK` 和更新后的 8.1 素材对象。

### 8.6 复制素材

- 接口名称：复制素材
- 接口功能：复制指定素材，`materialTitle` 自动追加 `（副本）`，价格、库存、规格和资源地址一并复制，新记录为正常状态。
- 请求方式：`POST`
- 访问路径：`/api/admin/materials/{id}/copies`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
POST /api/admin/materials/4/copies HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: dcc57008-78b7-4b8c-8c88-1b38c28f203a
```

返回数据：`201 Created` 和复制后的 8.1 素材对象，例如 `materialTitle` 为 `电影调色预设包 V2（副本）`。

### 8.7 逻辑删除素材

- 接口名称：逻辑删除素材
- 接口功能：将素材标记为已删除。
- 请求方式：`DELETE`
- 访问路径：`/api/admin/materials/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
DELETE /api/admin/materials/4 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：成功时返回 `204 No Content`；重复删除保持幂等。

### 8.8 恢复素材

- 接口名称：恢复素材
- 接口功能：将已删除素材恢复为正常状态。
- 请求方式：`PATCH`
- 访问路径：`/api/admin/materials/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；body 仅允许 `isDeleted=false`。

使用示例：

```http
PATCH /api/admin/materials/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "isDeleted": false
}
```

返回数据：`200 OK` 和恢复后的 8.1 素材对象，其中 `isDeleted=false`；重复恢复保持幂等。

## 9. 矩阵账号管理模块

### 9.1 矩阵账号对象

| 字段 | 类型 | 可空 | 写入约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | integer | 否 | 只读 | 矩阵账号 ID |
| `platformName` | string | 否 | 1-255 字符 | 平台名称 |
| `platformLogo` | string | 是 | HTTPS URL，最长 500 | 平台 Logo |
| `accountUrl` | string | 是 | HTTPS URL，最长 1000 | 账号地址 |
| `intro` | string | 是 | 最长 5000 字符 | 平台账号简介 |
| `createTime` | string(datetime) | 否 | 只读 | 创建时间 |
| `updateTime` | string(datetime) | 否 | 只读 | 更新时间 |
| `isDeleted` | boolean | 否 | 只读 | 删除标记 |

分页搜索字段：`platformName`、`intro`。排序白名单：`id`、`platformName`、`createTime`、`updateTime`。

### 9.2 分页查询矩阵账号

- 接口名称：分页查询矩阵账号
- 接口功能：按平台名称、简介和数据状态查询矩阵账号列表。
- 请求方式：`GET`
- 访问路径：`/api/admin/matrix-accounts`
- 是否鉴权：是
- 请求参数：见 1.6 通用分页参数。

使用示例：

```http
GET /api/admin/matrix-accounts?page=1&pageSize=10&keyword=B站&status=normal HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：分页对象，`list` 元素为 9.1 矩阵账号对象。

```json
{
  "list": [
    {
      "id": 2,
      "platformName": "B站",
      "platformLogo": "https://cdn.example.com/logos/bilibili.png",
      "accountUrl": "https://space.bilibili.com/example",
      "intro": "偏长内容与系列化专题，适合深度解析。",
      "createTime": "2026-07-16T21:00:00+08:00",
      "updateTime": "2026-07-16T21:00:00+08:00",
      "isDeleted": false
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 9.3 获取矩阵账号详情

- 接口名称：获取矩阵账号详情
- 接口功能：获取查看或编辑弹窗所需的完整矩阵账号数据。
- 请求方式：`GET`
- 访问路径：`/api/admin/matrix-accounts/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer。

使用示例：

```http
GET /api/admin/matrix-accounts/2 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：9.1 矩阵账号对象，示例与 9.2 的 `list[0]` 相同；允许读取已逻辑删除记录。

### 9.4 新增矩阵账号

- 接口名称：新增矩阵账号
- 接口功能：新增一个内容平台品牌账号入口。
- 请求方式：`POST`
- 访问路径：`/api/admin/matrix-accounts`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `platformName` | body | string | 是 | 平台名称 |
| `platformLogo` | body | string \| null | 否 | 平台 Logo URL |
| `accountUrl` | body | string \| null | 否 | 账号地址 |
| `intro` | body | string \| null | 否 | 平台账号简介 |

使用示例：

```http
POST /api/admin/matrix-accounts HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: ca94843a-27bd-4229-bf71-9e18f37f1d15
Content-Type: application/json

{
  "platformName": "YouTube",
  "platformLogo": "https://cdn.example.com/logos/youtube.png",
  "accountUrl": "https://www.youtube.com/@example",
  "intro": "发布带英文字幕的电影解析内容。"
}
```

返回数据：`201 Created` 和新建后的 9.1 矩阵账号对象。

```json
{
  "id": 4,
  "platformName": "YouTube",
  "platformLogo": "https://cdn.example.com/logos/youtube.png",
  "accountUrl": "https://www.youtube.com/@example",
  "intro": "发布带英文字幕的电影解析内容。",
  "createTime": "2026-07-17T11:00:00+08:00",
  "updateTime": "2026-07-17T11:00:00+08:00",
  "isDeleted": false
}
```

### 9.5 更新矩阵账号

- 接口名称：更新矩阵账号
- 接口功能：完整更新指定平台账号的名称、Logo、入口和简介。
- 请求方式：`PUT`
- 访问路径：`/api/admin/matrix-accounts/{id}`
- 是否鉴权：是

请求参数：`id` 为必填 path integer；body 参数与 9.4 相同，必须提交完整可写对象。

使用示例：

```http
PUT /api/admin/matrix-accounts/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "platformName": "YouTube",
  "platformLogo": "https://cdn.example.com/logos/youtube-v2.png",
  "accountUrl": "https://www.youtube.com/@pbwstudio",
  "intro": "发布中英双语电影解析内容。"
}
```

返回数据：`200 OK` 和更新后的 9.1 矩阵账号对象。

### 9.6 复制矩阵账号

- 接口名称：复制矩阵账号
- 接口功能：复制指定矩阵账号，`platformName` 自动追加 `（副本）`，新记录为正常状态。
- 请求方式：`POST`
- 访问路径：`/api/admin/matrix-accounts/{id}/copies`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
POST /api/admin/matrix-accounts/4/copies HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: a66bb56d-1e30-457d-bdc6-27fb51fe1b2f
```

返回数据：`201 Created` 和复制后的 9.1 矩阵账号对象，例如 `platformName` 为 `YouTube（副本）`。

### 9.7 逻辑删除矩阵账号

- 接口名称：逻辑删除矩阵账号
- 接口功能：将矩阵账号标记为已删除。
- 请求方式：`DELETE`
- 访问路径：`/api/admin/matrix-accounts/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
DELETE /api/admin/matrix-accounts/4 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：成功时返回 `204 No Content`；重复删除保持幂等。

### 9.8 恢复矩阵账号

- 接口名称：恢复矩阵账号
- 接口功能：将已删除矩阵账号恢复为正常状态。
- 请求方式：`PATCH`
- 访问路径：`/api/admin/matrix-accounts/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；body 仅允许 `isDeleted=false`。

使用示例：

```http
PATCH /api/admin/matrix-accounts/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "isDeleted": false
}
```

返回数据：`200 OK` 和恢复后的 9.1 矩阵账号对象，其中 `isDeleted=false`；重复恢复保持幂等。

## 10. 课程管理模块

### 10.1 课程对象

| 字段 | 类型 | 可空 | 写入约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | integer | 否 | 只读 | 课程 ID |
| `courseName` | string | 否 | 1-255 字符 | 课程名称 |
| `courseTag` | string | 是 | 最长 255 字符 | 课程标签 |
| `courseIntro` | string | 是 | 最长 5000 字符 | 课程简介 |
| `coursePrice` | number | 否 | `0-99999999.99`，两位小数 | 课程价格 |
| `isOnline` | boolean | 否 | - | 是否上线 |
| `createTime` | string(datetime) | 否 | 只读 | 创建时间 |
| `updateTime` | string(datetime) | 否 | 只读 | 更新时间 |
| `isDeleted` | boolean | 否 | 只读 | 删除标记 |

分页搜索字段：`courseName`、`courseTag`。排序白名单：`id`、`courseName`、`coursePrice`、`isOnline`、`createTime`、`updateTime`。

### 10.2 分页查询课程

- 接口名称：分页查询课程
- 接口功能：按课程名称、标签和数据状态查询课程列表。
- 请求方式：`GET`
- 访问路径：`/api/admin/courses`
- 是否鉴权：是
- 请求参数：见 1.6 通用分页参数。

使用示例：

```http
GET /api/admin/courses?page=1&pageSize=10&keyword=剪辑&status=all HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：分页对象，`list` 元素为 10.1 课程对象。

```json
{
  "list": [
    {
      "id": 2,
      "courseName": "短视频剪辑实战课",
      "courseTag": "转场 / 节奏 / 音效",
      "courseIntro": "围绕短视频制作效率和画面张力，给出实操方法。",
      "coursePrice": 299.0,
      "isOnline": true,
      "createTime": "2026-07-16T21:00:00+08:00",
      "updateTime": "2026-07-16T21:00:00+08:00",
      "isDeleted": false
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 10.3 获取课程详情

- 接口名称：获取课程详情
- 接口功能：获取查看或编辑弹窗所需的完整课程数据。
- 请求方式：`GET`
- 访问路径：`/api/admin/courses/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer。

使用示例：

```http
GET /api/admin/courses/2 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：10.1 课程对象，示例与 10.2 的 `list[0]` 相同；允许读取已逻辑删除记录。

### 10.4 新增课程

- 接口名称：新增课程
- 接口功能：新增课程，并设置初始上线状态。
- 请求方式：`POST`
- 访问路径：`/api/admin/courses`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `courseName` | body | string | 是 | 课程名称 |
| `courseTag` | body | string \| null | 否 | 课程标签 |
| `courseIntro` | body | string \| null | 否 | 课程简介 |
| `coursePrice` | body | number | 是 | 课程价格 |
| `isOnline` | body | boolean | 是 | 是否上线 |

使用示例：

```http
POST /api/admin/courses HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: 249912f3-7c40-456c-b2c5-8eef3e1cad13
Content-Type: application/json

{
  "courseName": "镜头语言进阶课",
  "courseTag": "构图 / 运镜 / 调度",
  "courseIntro": "系统讲解镜头设计与场面调度。",
  "coursePrice": 499.0,
  "isOnline": false
}
```

返回数据：`201 Created` 和新建后的 10.1 课程对象。

```json
{
  "id": 4,
  "courseName": "镜头语言进阶课",
  "courseTag": "构图 / 运镜 / 调度",
  "courseIntro": "系统讲解镜头设计与场面调度。",
  "coursePrice": 499.0,
  "isOnline": false,
  "createTime": "2026-07-17T11:20:00+08:00",
  "updateTime": "2026-07-17T11:20:00+08:00",
  "isDeleted": false
}
```

### 10.5 更新课程

- 接口名称：更新课程
- 接口功能：完整更新课程内容、价格和上线状态。
- 请求方式：`PUT`
- 访问路径：`/api/admin/courses/{id}`
- 是否鉴权：是

请求参数：`id` 为必填 path integer；body 参数与 10.4 相同，必须提交完整可写对象。

使用示例：

```http
PUT /api/admin/courses/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "courseName": "镜头语言进阶课",
  "courseTag": "构图 / 运镜 / 调度",
  "courseIntro": "系统讲解镜头设计、场面调度与案例复盘。",
  "coursePrice": 499.0,
  "isOnline": true
}
```

返回数据：`200 OK` 和更新后的 10.1 课程对象。上线状态由本接口中的 `isOnline` 与原型编辑开关保持一致。

### 10.6 复制课程

- 接口名称：复制课程
- 接口功能：复制指定课程，`courseName` 自动追加 `（副本）`，课程价格和上线状态与原记录一致，新记录的 `isDeleted` 固定为 `false`。
- 请求方式：`POST`
- 访问路径：`/api/admin/courses/{id}/copies`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
POST /api/admin/courses/4/copies HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: 8530d324-3ed9-4f94-9240-3dedaf570f74
```

返回数据：`201 Created` 和复制后的 10.1 课程对象，例如 `courseName` 为 `镜头语言进阶课（副本）`。`isOnline` 保持原值，与当前原型复制逻辑一致。

### 10.7 逻辑删除课程

- 接口名称：逻辑删除课程
- 接口功能：将课程标记为已删除；删除时同时停止用户端展示。
- 请求方式：`DELETE`
- 访问路径：`/api/admin/courses/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
DELETE /api/admin/courses/4 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：成功时返回 `204 No Content`；重复删除保持幂等。服务端可保留原 `isOnline`，但用户端查询必须排除 `isDeleted=true` 的课程。

### 10.8 恢复课程

- 接口名称：恢复课程
- 接口功能：将已删除课程恢复为正常状态。
- 请求方式：`PATCH`
- 访问路径：`/api/admin/courses/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；body 仅允许 `isDeleted=false`。

使用示例：

```http
PATCH /api/admin/courses/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "isDeleted": false
}
```

返回数据：`200 OK` 和恢复后的 10.1 课程对象，其中 `isDeleted=false`；恢复不会自动改变 `isOnline`。

## 11. 用户管理模块

### 11.1 用户对象

| 字段 | 类型 | 可空 | 写入约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | integer | 否 | 只读 | 用户 ID |
| `nickname` | string | 否 | 1-255 字符 | 昵称 |
| `account` | string | 否 | 3-255 字符，唯一 | 登录账号 |
| `email` | string | 是 | 合法邮箱，最长 255，非空时唯一 | 邮箱 |
| `avatar` | string | 是 | HTTPS URL，最长 500 | 头像 |
| `role` | string | 否 | `用户`、`管理员` | 角色 |
| `passwordConfigured` | boolean | 否 | 只读 | 是否已设置可用密码 |
| `createTime` | string(datetime) | 否 | 只读 | 创建时间 |
| `updateTime` | string(datetime) | 否 | 只读 | 更新时间 |
| `isDeleted` | boolean | 否 | 只读 | 删除标记 |

分页搜索字段：`nickname`、`account`、`email`。排序白名单：`id`、`nickname`、`account`、`role`、`createTime`、`updateTime`。

安全约束：

- 用户对象永远不包含 `password` 或 `passwordHash`；
- 原型表格中的密码列只显示固定掩码，不依赖服务端返回密码；
- 新增时 `password` 必填，更新时 `password` 可选；不传表示保持原密码；
- 服务端使用 Argon2id 或 bcrypt 等专用密码算法加盐散列，不得明文存储；
- 不允许删除当前登录管理员；系统仅剩一个正常管理员时，不允许删除该管理员或将其角色改为 `用户`。

### 11.2 分页查询用户

- 接口名称：分页查询用户
- 接口功能：按昵称、账号、邮箱和数据状态查询系统用户。
- 请求方式：`GET`
- 访问路径：`/api/admin/users`
- 是否鉴权：是
- 请求参数：见 1.6 通用分页参数。

使用示例：

```http
GET /api/admin/users?page=1&pageSize=10&keyword=movie&status=normal HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：分页对象，`list` 元素为 11.1 用户对象。

```json
{
  "list": [
    {
      "id": 2,
      "nickname": "movie_fan",
      "account": "movie_fan",
      "email": "moviefan@example.com",
      "avatar": "https://cdn.example.com/avatars/user-1.jpg",
      "role": "用户",
      "passwordConfigured": true,
      "createTime": "2026-07-16T21:00:00+08:00",
      "updateTime": "2026-07-16T21:00:00+08:00",
      "isDeleted": false
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 11.3 获取用户详情

- 接口名称：获取用户详情
- 接口功能：获取查看或编辑弹窗所需的用户资料，不返回密码。
- 请求方式：`GET`
- 访问路径：`/api/admin/users/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer。

使用示例：

```http
GET /api/admin/users/2 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：11.1 用户对象，示例与 11.2 的 `list[0]` 相同；允许读取已逻辑删除记录。

### 11.4 新增用户

- 接口名称：新增用户
- 接口功能：由管理员新增普通用户或管理员账号。
- 请求方式：`POST`
- 访问路径：`/api/admin/users`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `nickname` | body | string | 是 | 昵称 |
| `account` | body | string | 是 | 唯一登录账号 |
| `password` | body | string | 是 | 8-72 字符，至少包含字母和数字 |
| `email` | body | string \| null | 否 | 唯一邮箱 |
| `avatar` | body | string \| null | 否 | 头像 URL |
| `role` | body | string | 是 | `用户`、`管理员` |

使用示例：

```http
POST /api/admin/users HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: 55e6c7e8-1d79-4886-85c6-2015477969d7
Content-Type: application/json

{
  "nickname": "film_student",
  "account": "film_student",
  "password": "PbW2026pass",
  "email": "student@example.com",
  "avatar": "https://cdn.example.com/avatars/student.jpg",
  "role": "用户"
}
```

返回数据：`201 Created` 和新建后的 11.1 用户对象，不包含请求中的密码。

```json
{
  "id": 4,
  "nickname": "film_student",
  "account": "film_student",
  "email": "student@example.com",
  "avatar": "https://cdn.example.com/avatars/student.jpg",
  "role": "用户",
  "passwordConfigured": true,
  "createTime": "2026-07-17T11:40:00+08:00",
  "updateTime": "2026-07-17T11:40:00+08:00",
  "isDeleted": false
}
```

账号或邮箱冲突时返回 `409 RESOURCE_CONFLICT`，`fieldErrors[].field` 指向 `account` 或 `email`。

### 11.5 更新用户

- 接口名称：更新用户
- 接口功能：更新用户资料、角色，并可选择重置密码。
- 请求方式：`PUT`
- 访问路径：`/api/admin/users/{id}`
- 是否鉴权：是

请求参数：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | integer | 是 | 用户 ID |
| `nickname` | body | string | 是 | 昵称 |
| `account` | body | string | 是 | 登录账号 |
| `password` | body | string \| null | 否 | 新密码；不传或传 `null` 表示保持原密码 |
| `email` | body | string \| null | 否 | 邮箱 |
| `avatar` | body | string \| null | 否 | 头像 URL |
| `role` | body | string | 是 | `用户`、`管理员` |

使用示例：

```http
PUT /api/admin/users/4 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "nickname": "film_student_01",
  "account": "film_student",
  "password": null,
  "email": "student-new@example.com",
  "avatar": "https://cdn.example.com/avatars/student.jpg",
  "role": "用户"
}
```

返回数据：`200 OK` 和更新后的 11.1 用户对象。若重置了当前登录管理员自己的密码，服务端应使其他已有会话失效。

### 11.6 复制用户

- 接口名称：复制用户
- 接口功能：复制用户的昵称、头像和角色，生成唯一账号；不复制邮箱和密码。
- 请求方式：`POST`
- 访问路径：`/api/admin/users/{id}/copies`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
POST /api/admin/users/2/copies HTTP/1.1
Authorization: Bearer <accessToken>
Idempotency-Key: 3111eff1-e7de-44b0-9cf1-0ed5fb502a55
```

返回数据：`201 Created` 和复制后的 11.1 用户对象。服务端将昵称追加 `（副本）`，账号按 `{原账号}_copy_{新记录ID}` 生成，`email=null`、`passwordConfigured=false`。该账号在管理员通过 11.5 设置密码前不得登录。

```json
{
  "id": 5,
  "nickname": "movie_fan（副本）",
  "account": "movie_fan_copy_5",
  "email": null,
  "avatar": "https://cdn.example.com/avatars/user-1.jpg",
  "role": "用户",
  "passwordConfigured": false,
  "createTime": "2026-07-17T11:50:00+08:00",
  "updateTime": "2026-07-17T11:50:00+08:00",
  "isDeleted": false
}
```

### 11.7 逻辑删除用户

- 接口名称：逻辑删除用户
- 接口功能：将用户标记为已删除，并立即使该用户的全部登录会话失效。
- 请求方式：`DELETE`
- 访问路径：`/api/admin/users/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；无请求体。

使用示例：

```http
DELETE /api/admin/users/5 HTTP/1.1
Authorization: Bearer <accessToken>
```

返回数据：成功时返回 `204 No Content`；重复删除保持幂等。删除当前管理员或最后一个正常管理员时返回 `409 RESOURCE_CONFLICT`。

### 11.8 恢复用户

- 接口名称：恢复用户
- 接口功能：将已删除用户恢复为正常状态。
- 请求方式：`PATCH`
- 访问路径：`/api/admin/users/{id}`
- 是否鉴权：是
- 请求参数：`id` 为必填 path integer；body 仅允许 `isDeleted=false`。

使用示例：

```http
PATCH /api/admin/users/5 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "isDeleted": false
}
```

返回数据：`200 OK` 和恢复后的 11.1 用户对象，其中 `isDeleted=false`。恢复不会创建登录会话；`passwordConfigured=false` 的用户仍需先设置密码。

## 12. 前后端对接清单

本节是接口实现的强制一致性要求，不属于可选建议。

### 12.1 前端字段与交互映射

| 原型行为 | 接口要求 |
| --- | --- |
| 登录 | `POST /api/admin/session`，成功响应字段保持为 `token`、`nickname`、`role` |
| 恢复当前会话 | `GET /api/admin/session` |
| 退出 | `DELETE /api/admin/session` |
| 登录页“记住登录状态” | 仅影响前端存储方式，不加入接口请求参数 |
| 登录页“忘记密码” | 对接 `/api/admin/password-reset-requests` 和 `/api/admin/password-resets` |
| 工作台 | 使用一个 `GET /api/admin/dashboard` 请求完成首屏数据加载 |
| 搜索框 | 防抖后发送 `keyword`，各模块搜索字段必须与页面配置一致 |
| 状态筛选 | 原样发送 `all`、`normal`、`deleted` |
| 分页器 | 绑定当前页并发送 `page`、`pageSize`；切换筛选条件后回到第 1 页 |
| 查看 | `GET /{resource}/{id}` 后打开只读弹窗 |
| 新增 | 先 `POST /files` 上传媒体，再 `POST /{resource}` 创建记录 |
| 编辑 | `GET /{resource}/{id}` 回填，保存时 `PUT /{resource}/{id}` |
| 复制记录 | `POST /{resource}/{id}/copies`，使用服务端返回的新记录刷新列表 |
| 标记删除 | `DELETE /{resource}/{id}`，成功后更新当前行或重新拉取当前页 |
| 恢复记录 | `PATCH /{resource}/{id}` 并提交 `isDeleted=false` |

当前 `apiClient` 的 `baseURL` 为 `/api`，因此前端接口模块传给 Axios 的相对路径应从 `/admin/...` 开始，例如：

```ts
apiClient.get('/admin/videos', { params })
apiClient.get(`/admin/videos/${id}`)
apiClient.post('/admin/videos', payload)
apiClient.put(`/admin/videos/${id}`, payload)
apiClient.post(`/admin/videos/${id}/copies`)
apiClient.delete(`/admin/videos/${id}`)
apiClient.patch(`/admin/videos/${id}`, { isDeleted: false })
```

当前通用 CRUD 接口层已经采用集合和单资源结构；正式对接时需要补充 `/admin` 命名空间，并按本文档增加复制子资源、恢复状态和会话接口。

### 12.2 前端类型要求

- `PageResult<T>` 应包含 `list`、`total`、`page`、`pageSize`、`totalPages`；
- `BasicInfo`、`Video`、`MaterialLibrary`、`MatrixAccount`、`Course` 字段与本文档对象定义一致；
- 查询用的 `User` 类型必须移除 `password`，增加 `passwordConfigured`；
- 创建用户请求单独定义 `CreateUserRequest`，包含必填 `password`；
- 更新用户请求单独定义 `UpdateUserRequest`，`password` 为可选或可空字段；
- 用户编辑表单不得回填任何密码占位值，也不得强制管理员每次编辑资料都重置密码；
- Axios 成功响应直接读取 `response.data`，不再二次读取 `response.data.data`；
- 401 响应应清理本地会话并跳转登录页，403、404、409、422 应展示服务端 `detail` 或 `fieldErrors`。

### 12.3 数据库一致性要求

原型中的素材实体包含 `stock` 和 `specifications`，但当前 `database.sql` 的 `material_library` 表尚未定义这两个字段。实现素材接口前必须补充数据库迁移，建议类型如下：

```sql
`stock` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '基础库存',
`specifications` JSON NOT NULL COMMENT '规格名称和值数组'
```

用户复制流程需要区分“存在不可用随机散列”和“管理员已设置可用密码”，建议为 `users` 增加：

```sql
`password_configured` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否已设置可用密码'
```

其他强制要求：

- `users.password` 只存储密码散列；当前示例明文密码仅用于前端原型，不得进入生产数据；
- `annual_top_10_films`、`influential_three_directors`、`specifications` 写入前必须校验为合法 JSON 数组；
- 所有查询必须显式处理 `is_deleted`，禁止把已删除内容泄漏到后续用户端接口；
- `GET /api/admin/basic-info` 按 `is_deleted=0`、`create_time desc`、`id desc` 取第一条；
- 账号和邮箱的唯一性规则必须明确是否包含已删除用户。建议已删除用户仍占用原账号和邮箱，以确保恢复操作稳定；
- 工作台趋势率需要历史快照或审计数据支持；数据源未建设前返回 `null`。

### 12.4 并发、审计与可观测性

- 服务端应在日志中记录 `requestId`、管理员 ID、接口路径、目标记录 ID、结果和耗时，但不得记录密码、令牌或完整敏感请求体；
- 新增、更新、复制、删除、恢复应记录管理员操作审计日志；
- 业务写操作应放在事务中，复制素材时实体和规格必须原子写入；
- 列表查询应对 `isDeleted`、`createTime` 及常用搜索字段建立适当索引；
- 每个响应应返回 `X-Request-Id`；错误响应中的 `requestId` 与其一致；
- 管理端响应默认设置 `Cache-Control: no-store`；媒体 CDN 资源可使用长期缓存和内容指纹；
- CORS 只允许配置的管理端域名，不允许携带凭证时使用通配来源。

## 13. 验收标准

后端实现和前端联调至少满足以下条件：

1. 管理端全部接口路径以 `/api/admin/` 开头，只使用资源名和资源标识，不使用操作动词；
2. 所有 JSON、query、form-data 参数使用 camelCase；
3. 登录以外的接口在无令牌、无管理员角色时分别正确返回 401、403；
4. 五个表格模块的搜索字段、状态筛选、分页结果与原型一致；
5. 五个表格模块均可查看、新增、编辑、复制、逻辑删除和恢复；
6. 图片限制 10MB、视频限制 100MB，非法类型和超限文件返回明确错误；
7. 基本信息的影片数组最多 10 项、导演数组最多 3 项；
8. 素材价格支持两位小数，库存为非负整数，规格名称和值成对出现；
9. 课程上线状态使用 boolean，并且已删除课程不会出现在用户端；
10. 用户列表和详情不返回密码，账号和邮箱冲突返回 409；
11. 删除和恢复接口幂等，重复调用不产生额外记录或异常状态；
12. 所有时间为 ISO 8601，所有可空字段使用 `null`；
13. 前端刷新、网络失败、422 字段错误和令牌过期均有可理解的反馈；
14. 接口应提供 OpenAPI 3.1 定义，并通过请求/响应契约测试验证本文档示例。

## 14. 用户端接口（待补充）

用户端接口尚未纳入本版本，后续统一追加在本章节下，路径必须遵循：

```text
/api/user/{resource}
```

用户端接口不得复用 `/api/admin/` 路径，也不得返回管理字段、已删除数据、未上线课程或其他仅供后台使用的信息。
