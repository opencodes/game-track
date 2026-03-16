<?php

namespace App\Modules\GameTrack\Controllers;

use App\Core\Database;
use App\Core\Response;
use App\Modules\GameTrack\Services\GameTrackSchema;
use PDO;

class LeaderboardController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
        GameTrackSchema::ensure($this->db);
    }

    public function list(): void
    {
        $stmt = $this->db->query(
            'SELECT uid, username, displayName, avatar, level, xp
             FROM users
             ORDER BY level DESC, xp DESC
             LIMIT 10'
        );

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
