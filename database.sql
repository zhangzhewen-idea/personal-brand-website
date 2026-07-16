-- 数据库表结构定义
-- 适用于 MySQL 8.0+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 基本信息表
DROP TABLE IF EXISTS `basic_info`;
CREATE TABLE `basic_info` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `home_cover_video` VARCHAR(500) DEFAULT NULL COMMENT '首页封面视频',
  `contact_email` VARCHAR(255) DEFAULT NULL COMMENT '联系邮箱',
  `contact_qr_code` VARCHAR(500) DEFAULT NULL COMMENT '联系二维码',
  `total_play_count` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '全网播放量',
  `total_like_count` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '全网点赞数',
  `total_follower_count` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '全网粉丝数',
  `author_identity_tag` VARCHAR(255) DEFAULT NULL COMMENT '作者身份标签',
  `slogan` VARCHAR(255) DEFAULT NULL COMMENT 'slogan',
  `creation_attitude` TEXT COMMENT '创作态度',
  `author_photo` VARCHAR(500) DEFAULT NULL COMMENT '作者照片',
  `editing_desk_work_photo` VARCHAR(500) DEFAULT NULL COMMENT '剪辑台工作照',
  `asset_library_screenshot` VARCHAR(500) DEFAULT NULL COMMENT '素材库截图',
  `daily_movie_watching_photo` VARCHAR(500) DEFAULT NULL COMMENT '观影日常照片',
  `annual_top_10_films` TEXT COMMENT '年度十佳影片（jsonArray 格式）',
  `influential_three_directors` TEXT COMMENT '影响我的三位导演（jsonArray 格式）',
  `contact_info` VARCHAR(500) DEFAULT NULL COMMENT '联系方式',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（逻辑删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='基本信息表';

-- 视频表
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `video_title` VARCHAR(255) NOT NULL COMMENT '视频标题',
  `video_intro` TEXT COMMENT '视频介绍',
  `video_url` VARCHAR(1000) NOT NULL COMMENT '视频地址',
  `video_cover` VARCHAR(500) DEFAULT NULL COMMENT '视频封面',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（逻辑删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频表';

-- 素材库表
DROP TABLE IF EXISTS `material_library`;
CREATE TABLE `material_library` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `material_title` VARCHAR(255) NOT NULL COMMENT '素材标题',
  `material_photo` VARCHAR(500) DEFAULT NULL COMMENT '素材照片',
  `material_intro` TEXT COMMENT '素材介绍',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '价格',
  `netdisk_url` VARCHAR(1000) DEFAULT NULL COMMENT '网盘地址',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（逻辑删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='素材库表';

-- 矩阵账号表
DROP TABLE IF EXISTS `matrix_account`;
CREATE TABLE `matrix_account` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `platform_name` VARCHAR(255) NOT NULL COMMENT '平台名称',
  `platform_logo` VARCHAR(500) DEFAULT NULL COMMENT '平台logo',
  `account_url` VARCHAR(1000) DEFAULT NULL COMMENT '账号地址',
  `intro` TEXT COMMENT '简介',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（逻辑删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='矩阵账号表';

-- 课程表
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `course_name` VARCHAR(255) NOT NULL COMMENT '课程名称',
  `course_tag` VARCHAR(255) DEFAULT NULL COMMENT '课程标签',
  `course_intro` TEXT COMMENT '课程简介',
  `course_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '课程价格',
  `is_online` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否上线',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（逻辑删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- 用户表
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `nickname` VARCHAR(255) NOT NULL COMMENT '昵称',
  `account` VARCHAR(255) NOT NULL COMMENT '账号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `email` VARCHAR(255) DEFAULT NULL COMMENT '邮箱',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `role` ENUM('用户', '管理员') NOT NULL DEFAULT '用户' COMMENT '角色（用户、管理员）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（逻辑删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_account` (`account`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 示例数据

INSERT INTO `basic_info` (
  `home_cover_video`,
  `contact_email`,
  `contact_qr_code`,
  `total_play_count`,
  `total_like_count`,
  `total_follower_count`,
  `author_identity_tag`,
  `slogan`,
  `creation_attitude`,
  `author_photo`,
  `editing_desk_work_photo`,
  `asset_library_screenshot`,
  `daily_movie_watching_photo`,
  `annual_top_10_films`,
  `influential_three_directors`,
  `contact_info`,
  `create_time`,
  `update_time`,
  `is_deleted`
) VALUES
(
  'https://cdn.example.com/videos/home-cover-1.mp4',
  'contact@example.com',
  'https://cdn.example.com/qrcode/contact-qr-1.png',
  12800000,
  860000,
  240000,
  '电影解说创作者 / 剪辑师',
  '用镜头拆解故事',
  '先理解，再表达；先克制，再准确。',
  'https://cdn.example.com/images/author-photo-1.jpg',
  'https://cdn.example.com/images/editing-desk-1.jpg',
  'https://cdn.example.com/images/asset-library-1.jpg',
  'https://cdn.example.com/images/daily-movie-1.jpg',
  JSON_ARRAY('《奥本海默》', '《爱乐之城》', '《燃烧女子的肖像》', '《敦刻尔克》', '《寄生虫》'),
  JSON_ARRAY('希区柯克', '诺兰', '是枝裕和'),
  '微信：brandstudio01',
  NOW(),
  NOW(),
  0
);

INSERT INTO `video` (
  `video_title`,
  `video_intro`,
  `video_url`,
  `video_cover`,
  `create_time`,
  `update_time`,
  `is_deleted`
) VALUES
(
  '为什么这部电影能封神',
  '从叙事结构、镜头语言和人物动机三个角度拆解。',
  'https://cdn.example.com/videos/video-1.mp4',
  'https://cdn.example.com/covers/video-cover-1.jpg',
  NOW(),
  NOW(),
  0
),
(
  '三分钟看懂角色弧光',
  '用一个完整案例讲清角色变化如何服务主题表达。',
  'https://cdn.example.com/videos/video-2.mp4',
  'https://cdn.example.com/covers/video-cover-2.jpg',
  NOW(),
  NOW(),
  0
),
(
  '我最常用的剪辑节奏模板',
  '分享节奏控制、转场和音效搭配的常用方法。',
  'https://cdn.example.com/videos/video-3.mp4',
  'https://cdn.example.com/covers/video-cover-3.jpg',
  NOW(),
  NOW(),
  0
);

INSERT INTO `material_library` (
  `material_title`,
  `material_photo`,
  `material_intro`,
  `price`,
  `netdisk_url`,
  `create_time`,
  `update_time`,
  `is_deleted`
) VALUES
(
  '电影海报素材包',
  'https://cdn.example.com/materials/poster-pack.jpg',
  '适合电影解说封面、分镜展示和宣传页使用。',
  39.90,
  'https://pan.example.com/s/abcd1234',
  NOW(),
  NOW(),
  0
),
(
  '转场动效合集',
  'https://cdn.example.com/materials/transition-pack.jpg',
  '包含 100+ 常用转场，适合短视频快节奏剪辑。',
  59.00,
  'https://pan.example.com/s/efgh5678',
  NOW(),
  NOW(),
  0
),
(
  '字幕样式模板',
  'https://cdn.example.com/materials/subtitle-pack.jpg',
  '适合打造统一视觉风格的片头字幕与重点标注。',
  29.00,
  'https://pan.example.com/s/ijkl9012',
  NOW(),
  NOW(),
  0
);

INSERT INTO `matrix_account` (
  `platform_name`,
  `platform_logo`,
  `account_url`,
  `intro`,
  `create_time`,
  `update_time`,
  `is_deleted`
) VALUES
(
  '抖音',
  'https://cdn.example.com/logos/douyin.png',
  'https://www.douyin.com/user/example',
  '主阵地账号，更新电影解说和剪辑技巧内容。',
  NOW(),
  NOW(),
  0
),
(
  'B站',
  'https://cdn.example.com/logos/bilibili.png',
  'https://space.bilibili.com/example',
  '偏长内容与系列化专题，适合深度解析。',
  NOW(),
  NOW(),
  0
),
(
  '小红书',
  'https://cdn.example.com/logos/xiaohongshu.png',
  'https://www.xiaohongshu.com/user/profile/example',
  '偏图文和短视频种草，展示幕后和素材整理。',
  NOW(),
  NOW(),
  0
);

INSERT INTO `course` (
  `course_name`,
  `course_tag`,
  `course_intro`,
  `course_price`,
  `is_online`,
  `create_time`,
  `update_time`,
  `is_deleted`
) VALUES
(
  '电影解说入门课',
  '剪辑 / 解说 / 表达',
  '从选题、脚本到剪辑节奏，完整覆盖入门流程。',
  199.00,
  1,
  NOW(),
  NOW(),
  0
),
(
  '短视频剪辑实战课',
  '转场 / 节奏 / 音效',
  '围绕短视频制作效率和画面张力，给出实操方法。',
  299.00,
  1,
  NOW(),
  NOW(),
  0
),
(
  '账号内容增长课',
  '选题 / 复盘 / 增长',
  '帮助创作者建立稳定更新和数据复盘机制。',
  399.00,
  0,
  NOW(),
  NOW(),
  0
);

INSERT INTO `users` (
  `nickname`,
  `account`,
  `password`,
  `email`,
  `avatar`,
  `role`,
  `create_time`,
  `update_time`,
  `is_deleted`
) VALUES
(
  '管理员',
  'admin',
  '123456',
  'admin@example.com',
  'https://cdn.example.com/avatars/admin.jpg',
  '管理员',
  NOW(),
  NOW(),
  0
),
(
  'movie_fan',
  'movie_fan',
  '123456',
  'moviefan@example.com',
  'https://cdn.example.com/avatars/user-1.jpg',
  '用户',
  NOW(),
  NOW(),
  0
),
(
  'editor_life',
  'editor_life',
  '123456',
  'editorlife@example.com',
  'https://cdn.example.com/avatars/user-2.jpg',
  '用户',
  NOW(),
  NOW(),
  0
);

SET FOREIGN_KEY_CHECKS = 1;
