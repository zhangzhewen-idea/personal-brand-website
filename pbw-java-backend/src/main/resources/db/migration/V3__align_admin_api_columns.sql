SET @stock_column_count = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'material_library'
      AND COLUMN_NAME = 'stock'
);
SET @stock_ddl = IF(
    @stock_column_count = 0,
    'ALTER TABLE `material_library` ADD COLUMN `stock` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT ''基础库存'' AFTER `price`',
    'SELECT 1'
);
PREPARE stock_statement FROM @stock_ddl;
EXECUTE stock_statement;
DEALLOCATE PREPARE stock_statement;

SET @specifications_column_count = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'material_library'
      AND COLUMN_NAME = 'specifications'
);
SET @specifications_ddl = IF(
    @specifications_column_count = 0,
    'ALTER TABLE `material_library` ADD COLUMN `specifications` JSON NULL COMMENT ''规格名称和值数组'' AFTER `stock`',
    'SELECT 1'
);
PREPARE specifications_statement FROM @specifications_ddl;
EXECUTE specifications_statement;
DEALLOCATE PREPARE specifications_statement;

UPDATE `material_library`
SET `specifications` = JSON_ARRAY()
WHERE `specifications` IS NULL;

ALTER TABLE `material_library`
    MODIFY COLUMN `specifications` JSON NOT NULL COMMENT '规格名称和值数组';
