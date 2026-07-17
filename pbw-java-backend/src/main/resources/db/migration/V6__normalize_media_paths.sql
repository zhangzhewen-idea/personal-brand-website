-- 媒体资源统一保存为域名根目录相对路径，外部业务链接不处理。
UPDATE `basic_info`
SET `home_cover_video` = REGEXP_REPLACE(`home_cover_video`, '^https?://[^/]+', ''),
    `contact_qr_code` = REGEXP_REPLACE(`contact_qr_code`, '^https?://[^/]+', ''),
    `author_photo` = REGEXP_REPLACE(`author_photo`, '^https?://[^/]+', ''),
    `editing_desk_work_photo` = REGEXP_REPLACE(`editing_desk_work_photo`, '^https?://[^/]+', ''),
    `asset_library_screenshot` = REGEXP_REPLACE(`asset_library_screenshot`, '^https?://[^/]+', ''),
    `daily_movie_watching_photo` = REGEXP_REPLACE(`daily_movie_watching_photo`, '^https?://[^/]+', '')
WHERE `home_cover_video` REGEXP '^https?://'
   OR `contact_qr_code` REGEXP '^https?://'
   OR `author_photo` REGEXP '^https?://'
   OR `editing_desk_work_photo` REGEXP '^https?://'
   OR `asset_library_screenshot` REGEXP '^https?://'
   OR `daily_movie_watching_photo` REGEXP '^https?://';

UPDATE `video`
SET `video_url` = REGEXP_REPLACE(`video_url`, '^https?://[^/]+', ''),
    `video_cover` = REGEXP_REPLACE(`video_cover`, '^https?://[^/]+', '')
WHERE `video_url` REGEXP '^https?://'
   OR `video_cover` REGEXP '^https?://';

UPDATE `material_library`
SET `material_photo` = REGEXP_REPLACE(`material_photo`, '^https?://[^/]+', '')
WHERE `material_photo` REGEXP '^https?://';

UPDATE `matrix_account`
SET `platform_logo` = REGEXP_REPLACE(`platform_logo`, '^https?://[^/]+', '')
WHERE `platform_logo` REGEXP '^https?://';

UPDATE `users`
SET `avatar` = REGEXP_REPLACE(`avatar`, '^https?://[^/]+', '')
WHERE `avatar` REGEXP '^https?://';
