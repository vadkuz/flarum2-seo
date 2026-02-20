<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('seo_meta')) {
            return;
        }

        $connection = $schema->getConnection();
        $table = $connection->getTablePrefix() . 'seo_meta';

        $column = $connection->selectOne("SHOW COLUMNS FROM `{$table}` LIKE 'object_type'");
        $columnType = strtolower((string) ($column->Type ?? ''));

        if ($columnType !== 'varchar(191)') {
            $connection->statement("ALTER TABLE `{$table}` MODIFY `object_type` VARCHAR(191) NOT NULL");
        }

        $index = $connection->selectOne(
            "SHOW INDEX FROM `{$table}` WHERE Key_name = 'seo_meta_object_id_object_type_unique'"
        );

        if (!$index) {
            $connection->statement(
                "ALTER TABLE `{$table}` ADD UNIQUE `seo_meta_object_id_object_type_unique` (`object_id`, `object_type`)"
            );
        }
    },
    'down' => function () {
        // no-op: this migration only repairs invalid historical schema
    },
];
