<?php

namespace App\Modules\GameTrack\Services;

use PDO;

class GameTrackSchema
{
    private static bool $initialized = false;

    public static function ensure(PDO $db): void
    {
        if (self::$initialized) {
            return;
        }

        $schemaPath = dirname(__DIR__, 5) . '/db.sql';
        if (!file_exists($schemaPath)) {
            self::$initialized = true;
            return;
        }

        $sql = file_get_contents($schemaPath);
        if ($sql === false) {
            self::$initialized = true;
            return;
        }

        $statements = array_filter(array_map('trim', explode(';', $sql)));
        if (!$statements) {
            self::$initialized = true;
            return;
        }

        $db->exec('SET FOREIGN_KEY_CHECKS=0');

        $normalized = [];
        $tableStatements = [];
        foreach ($statements as $statement) {
            $statement = preg_replace('/^CREATE TABLE\s+`/i', 'CREATE TABLE IF NOT EXISTS `', $statement);
            $normalized[] = $statement;

            if (preg_match('/^CREATE TABLE IF NOT EXISTS\s+`([^`]+)`/i', $statement, $match)) {
                $tableStatements[strtolower($match[1])] = $statement;
            }
        }

        $ordered = [];
        foreach (['users', 'games', 'achievements'] as $table) {
            if (isset($tableStatements[$table])) {
                $ordered[] = $tableStatements[$table];
            }
        }

        foreach ($normalized as $statement) {
            if (!$statement) {
                continue;
            }
            if (preg_match('/^CREATE TABLE IF NOT EXISTS\s+`([^`]+)`/i', $statement, $match)) {
                $name = strtolower($match[1]);
                if (in_array($name, ['users', 'games', 'achievements'], true)) {
                    continue;
                }
            }
            $ordered[] = $statement;
        }

        foreach ($ordered as $statement) {
            if ($statement) {
                $db->exec($statement);
            }
        }

        $db->exec('SET FOREIGN_KEY_CHECKS=1');

        self::$initialized = true;
    }
}
