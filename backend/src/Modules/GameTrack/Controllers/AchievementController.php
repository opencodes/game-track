<?php

namespace App\Modules\GameTrack\Controllers;

use App\Core\Database;
use App\Core\Response;
use App\Modules\GameTrack\Services\GameTrackSchema;
use PDO;

class AchievementController
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
            'SELECT id, userId, achievementId, name, description, icon, unlocked, date
             FROM achievements
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
        $achievementId = $data['achievementId'] ?? null;
        $name = $data['name'] ?? null;
        $description = $data['description'] ?? null;
        $icon = $data['icon'] ?? null;
        $unlocked = isset($data['unlocked']) ? (int) (bool) $data['unlocked'] : 1;
        $date = $data['date'] ?? date('Y-m-d');

        if (!$userId || !$achievementId || !$name) {
            Response::json(['error' => 'userId, achievementId, and name are required'], 400);
        }

        $check = $this->db->prepare('SELECT uid FROM users WHERE uid = ?');
        $check->execute([$userId]);
        if (!$check->fetch()) {
            Response::json(['error' => 'User not found for userId', 'userId' => $userId], 400);
        }

        $stmt = $this->db->prepare(
            'INSERT INTO achievements (userId, achievementId, name, description, icon, unlocked, date)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $userId,
            $achievementId,
            $name,
            $description,
            $icon,
            $unlocked,
            $date,
        ]);

        Response::json([
            'success' => true,
            'id' => (int) $this->db->lastInsertId(),
        ], 201);
    }

    public function delete(?string $id): void
    {
        if (!$id) {
            Response::json(['error' => 'Achievement ID required'], 400);
        }

        $stmt = $this->db->prepare('DELETE FROM achievements WHERE id = ?');
        $stmt->execute([$id]);

        Response::json(['success' => true]);
    }
}
