<?php

namespace App\Modules\GameTrack\Controllers;

use App\Core\Database;
use App\Core\Response;
use App\Modules\GameTrack\Services\GameTrackSchema;
use PDO;

class GameController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
        GameTrackSchema::ensure($this->db);
    }

    public function list(?string $userId): void
    {
        if (!$userId) {
            Response::json(['error' => 'User ID required'], 400);
        }

        $stmt = $this->db->prepare(
            'SELECT id, userId, name, duration, date, xpEarned, levelAchieved, remark
             FROM games
             WHERE userId = ?
             ORDER BY date DESC, id DESC'
        );
        $stmt->execute([$userId]);

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $userId = $data['userId'] ?? null;
        $name = $data['name'] ?? null;
        $duration = $data['duration'] ?? null;
        $date = $data['date'] ?? date('Y-m-d');
        $xpEarned = $data['xpEarned'] ?? null;
        $levelAchieved = $data['levelAchieved'] ?? null;
        $remark = $data['remark'] ?? null;

        if (!$userId || !$name || $duration === null) {
            Response::json(['error' => 'userId, name, and duration are required'], 400);
        }

        $check = $this->db->prepare('SELECT uid FROM users WHERE uid = ?');
        $check->execute([$userId]);
        if (!$check->fetch()) {
            Response::json(['error' => 'User not found for userId', 'userId' => $userId], 400);
        }

        $stmt = $this->db->prepare(
            'INSERT INTO games (userId, name, duration, date, xpEarned, levelAchieved, remark)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $userId,
            $name,
            $duration,
            $date,
            $xpEarned,
            $levelAchieved,
            $remark,
        ]);

        Response::json([
            'success' => true,
            'id' => (int) $this->db->lastInsertId(),
        ], 201);
    }

    public function delete(?string $id): void
    {
        if (!$id) {
            Response::json(['error' => 'Game ID required'], 400);
        }

        $stmt = $this->db->prepare('DELETE FROM games WHERE id = ?');
        $stmt->execute([$id]);

        Response::json(['success' => true]);
    }
}
