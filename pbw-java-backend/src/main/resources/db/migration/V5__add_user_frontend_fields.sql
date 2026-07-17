ALTER TABLE `video`
    ADD COLUMN `platform_name` VARCHAR(255) DEFAULT NULL COMMENT '用户端展示平台' AFTER `video_cover`,
    ADD COLUMN `play_count_text` VARCHAR(50) DEFAULT NULL COMMENT '用户端格式化播放量' AFTER `platform_name`;

ALTER TABLE `material_library`
    ADD COLUMN `item_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '素材包项目数量' AFTER `netdisk_url`,
    ADD COLUMN `color_class` VARCHAR(50) NOT NULL DEFAULT 'bg-blue-500' COMMENT '用户端颜色类名' AFTER `item_count`,
    ADD COLUMN `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Scissors' COMMENT '用户端图标名称' AFTER `color_class`;

ALTER TABLE `matrix_account`
    ADD COLUMN `follower_count_text` VARCHAR(50) DEFAULT NULL COMMENT '用户端格式化粉丝数' AFTER `intro`,
    ADD COLUMN `color_class` VARCHAR(50) NOT NULL DEFAULT 'bg-blue-500' COMMENT '用户端颜色类名' AFTER `follower_count_text`;

ALTER TABLE `course`
    ADD COLUMN `duration` VARCHAR(50) DEFAULT NULL COMMENT '课程周期' AFTER `is_online`,
    ADD COLUMN `lesson_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '课时数' AFTER `duration`,
    ADD COLUMN `features` JSON NULL COMMENT '课程内容要点' AFTER `lesson_count`,
    ADD COLUMN `color_class` VARCHAR(50) NOT NULL DEFAULT 'bg-blue-500' COMMENT '用户端颜色类名' AFTER `features`,
    ADD COLUMN `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Video' COMMENT '用户端图标名称' AFTER `color_class`,
    ADD COLUMN `user_visible` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否允许用户端查看' AFTER `icon_name`;

UPDATE `course` SET `features` = JSON_ARRAY() WHERE `features` IS NULL;
ALTER TABLE `course` MODIFY COLUMN `features` JSON NOT NULL COMMENT '课程内容要点';

UPDATE `video` SET `platform_name` = '抖音', `play_count_text` = '180万' WHERE `video_title` = '为什么这部电影能封神';
UPDATE `video` SET `platform_name` = 'B站', `play_count_text` = '95万' WHERE `video_title` = '三分钟看懂角色弧光';
UPDATE `video` SET `platform_name` = '小红书', `play_count_text` = '62万' WHERE `video_title` = '我最常用的剪辑节奏模板';

UPDATE `material_library` SET `item_count` = 150, `color_class` = 'bg-blue-500', `icon_name` = 'Scissors' WHERE `material_title` = '电影海报素材包';
UPDATE `material_library` SET `item_count` = 300, `color_class` = 'bg-purple-500', `icon_name` = 'Volume2' WHERE `material_title` = '转场动效合集';
UPDATE `material_library` SET `item_count` = 20, `color_class` = 'bg-green-500', `icon_name` = 'Video' WHERE `material_title` = '字幕样式模板';

UPDATE `matrix_account` SET `follower_count_text` = '15万', `color_class` = 'bg-black' WHERE `platform_name` = '抖音';
UPDATE `matrix_account` SET `follower_count_text` = '8万', `color_class` = 'bg-pink-500' WHERE `platform_name` = 'B站';
UPDATE `matrix_account` SET `follower_count_text` = '5万', `color_class` = 'bg-red-500' WHERE `platform_name` = '小红书';

UPDATE `course`
SET `duration` = '8周', `lesson_count` = 32,
    `features` = JSON_ARRAY('Pr/Ae/Final Cut Pro 软件操作', '素材管理与整理逻辑', '基础转场与字幕设计', '音效与配乐选择技巧', '实战项目练习'),
    `color_class` = 'bg-blue-500', `icon_name` = 'Video', `user_visible` = 1
WHERE `course_name` = '电影解说入门课';

UPDATE `course`
SET `duration` = '10周', `lesson_count` = 40,
    `features` = JSON_ARRAY('蒙太奇思维与应用', '音效与画面的情绪配合', '影视混剪的故事重构法', '节奏控制与张力营造', '经典作品分析解构'),
    `color_class` = 'bg-purple-500', `icon_name` = 'GraduationCap', `user_visible` = 1
WHERE `course_name` = '短视频剪辑实战课';

UPDATE `course`
SET `duration` = '6周', `lesson_count` = 24,
    `features` = JSON_ARRAY('色彩理论与情绪表达', '数据复盘流程', '内容风格定位', '账号视觉统一', '不同场景实战'),
    `color_class` = 'bg-pink-500', `icon_name` = 'Palette', `user_visible` = 1
WHERE `course_name` = '账号内容增长课';

INSERT INTO `video` (`video_title`, `video_intro`, `video_url`, `video_cover`, `platform_name`, `play_count_text`)
SELECT '城市脉搏：延时摄影混剪', '捕捉城市的昼夜更替，感受时间的流动之美。', 'https://cdn.example.com/videos/video-4.mp4', 'https://cdn.example.com/covers/video-cover-4.jpg', '抖音', '210万'
WHERE NOT EXISTS (SELECT 1 FROM `video` WHERE `video_title` = '城市脉搏：延时摄影混剪');

INSERT INTO `material_library` (`material_title`, `material_photo`, `material_intro`, `price`, `stock`, `specifications`, `netdisk_url`, `item_count`, `color_class`, `icon_name`)
SELECT '粉丝福利', NULL, '免费素材整合包，持续更新。', 0.00, 100, JSON_ARRAY(), 'https://pan.example.com/s/fans', 100, 'bg-orange-500', 'Gift'
WHERE NOT EXISTS (SELECT 1 FROM `material_library` WHERE `material_title` = '粉丝福利');

INSERT INTO `matrix_account` (`platform_name`, `platform_logo`, `account_url`, `intro`, `follower_count_text`, `color_class`)
SELECT '视频号', 'https://cdn.example.com/logos/wechat-video.png', 'https://weixin.qq.com', '同步发布精选内容。', '3万', 'bg-green-500'
WHERE NOT EXISTS (SELECT 1 FROM `matrix_account` WHERE `platform_name` = '视频号');

INSERT INTO `course` (`course_name`, `course_tag`, `course_intro`, `course_price`, `is_online`, `duration`, `lesson_count`, `features`, `color_class`, `icon_name`, `user_visible`)
SELECT '短视频策划课', '实战级', '学习短视频策划与运营，打造爆款内容。', 999.00, 0, '8周', 32,
       JSON_ARRAY('短视频内容策划方法论', '爆款视频底层逻辑', '平台算法与推荐机制', '数据分析与优化迭代', '账号定位与IP打造'),
       'bg-green-500', 'TrendingUp', 1
WHERE NOT EXISTS (SELECT 1 FROM `course` WHERE `course_name` = '短视频策划课');

CREATE INDEX `idx_course_user_visible` ON `course` (`is_deleted`, `user_visible`, `create_time`, `id`);

UPDATE `users`
SET `password` = '$2a$10$AN7ItbpBow3xKdyuPFroZ.DjI7PJMfvVO4Vd6AFJ/jlD42/VqKx.6'
WHERE `password` = '123456';
