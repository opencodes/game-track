<?php

namespace App\Modules\GameTrack\Controllers;

use App\Core\Database;
use App\Core\Response;
use App\Modules\GameTrack\Services\GameTrackSchema;
use PDO;

class GameUserController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
        GameTrackSchema::ensure($this->db);
    }

    public function get(?string $uid): void
    {
        if (!$uid) {
            Response::json(['error' => 'User ID required'], 400);
        }

        $stmt = $this->db->prepare(
            'SELECT uid, username, email, displayName, avatar, dob, age, favoriteGame, level, xp, nextLevelXp, role, createdAt
             FROM users
             WHERE uid = ?'
        );
        $stmt->execute([$uid]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            Response::json(['error' => 'User not found'], 404);
        }

        Response::json($user);
    }

    public function list(): void
    {
        $stmt = $this->db->query(
            'SELECT uid, username, displayName, avatar, level, xp, nextLevelXp, role
             FROM users
             ORDER BY level DESC, xp DESC'
        );

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $uid = trim($data['uid'] ?? '') ?: bin2hex(random_bytes(16));
        $username = trim($data['username'] ?? '') ?: ('User_' . substr($uid, 0, 6));
        $email = trim($data['email'] ?? '') ?: ($uid . '@local');
        $displayName = trim($data['displayName'] ?? '') ?: $username;
        $dob = $data['dob'] ?? null;
        $age = $data['age'] ?? null;
        $favoriteGame = $data['favoriteGame'] ?? null;
        $avatar = $data['avatar'] ?? null;
        $level = isset($data['level']) ? (int) $data['level'] : 1;
        $xp = isset($data['xp']) ? (int) $data['xp'] : 0;
        $nextLevelXp = isset($data['nextLevelXp']) ? (int) $data['nextLevelXp'] : 1000;
        $role = $data['role'] ?? 'client';

        if ($dob && $age === null) {
            $age = date_diff(date_create($dob), date_create('today'))->y;
        }

        $plainPassword = $data['password'] ?? bin2hex(random_bytes(16));
        $passwordHash = password_hash($plainPassword, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare('SELECT uid FROM users WHERE uid = ?');
        $stmt->execute([$uid]);
        if ($stmt->fetch()) {
            $stmt = $this->db->prepare(
                'SELECT uid, username, email, displayName, avatar, dob, age, favoriteGame, level, xp, nextLevelXp, role, createdAt
                 FROM users
                 WHERE uid = ?'
            );
            $stmt->execute([$uid]);
            Response::json([
                'success' => true,
                'user' => $stmt->fetch(PDO::FETCH_ASSOC),
            ]);
        }

        $stmt = $this->db->prepare('SELECT uid FROM users WHERE username = ? OR email = ?');
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            Response::json(['error' => 'Username or email already exists'], 400);
        }

        $stmt = $this->db->prepare(
            'INSERT INTO users
            (uid, username, email, displayName, password, avatar, dob, age, favoriteGame, level, xp, nextLevelXp, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $uid,
            $username,
            $email,
            $displayName,
            $passwordHash,
            $avatar,
            $dob,
            $age,
            $favoriteGame,
            $level,
            $xp,
            $nextLevelXp,
            $role,
        ]);

        Response::json([
            'success' => true,
            'uid' => $uid,
            'user' => [
                'uid' => $uid,
                'username' => $username,
                'email' => $email,
                'displayName' => $displayName,
                'avatar' => $avatar,
                'dob' => $dob,
                'age' => $age,
                'favoriteGame' => $favoriteGame,
                'level' => $level,
                'xp' => $xp,
                'nextLevelXp' => $nextLevelXp,
                'role' => $role,
            ],
        ], 201);
    }

    public function update(?string $uid): void
    {
        if (!$uid) {
            Response::json(['error' => 'User ID required'], 400);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $fields = [];
        $values = [];
        $allowed = [
            'username' => 'username',
            'email' => 'email',
            'displayName' => 'displayName',
            'avatar' => 'avatar',
            'dob' => 'dob',
            'age' => 'age',
            'favoriteGame' => 'favoriteGame',
            'level' => 'level',
            'xp' => 'xp',
            'nextLevelXp' => 'nextLevelXp',
            'role' => 'role',
        ];

        foreach ($allowed as $key => $column) {
            if (array_key_exists($key, $data)) {
                $fields[] = "$column = ?";
                $values[] = $data[$key];
            }
        }

        if (array_key_exists('password', $data)) {
            $fields[] = 'password = ?';
            $values[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if (array_key_exists('dob', $data) && !array_key_exists('age', $data) && $data['dob']) {
            $fields[] = 'age = ?';
            $values[] = date_diff(date_create($data['dob']), date_create('today'))->y;
        }

        if (!$fields) {
            Response::json(['error' => 'No fields to update'], 400);
        }

        $values[] = $uid;
        $stmt = $this->db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE uid = ?');
        $stmt->execute($values);

        $stmt = $this->db->prepare(
            'SELECT uid, username, email, displayName, avatar, dob, age, favoriteGame, level, xp, nextLevelXp, role, createdAt
             FROM users
             WHERE uid = ?'
        );
        $stmt->execute([$uid]);

        Response::json([
            'success' => true,
            'user' => $stmt->fetch(PDO::FETCH_ASSOC),
        ]);
    }

    public function delete(?string $uid): void
    {
        if (!$uid) {
            Response::json(['error' => 'User ID required'], 400);
        }

        $stmt = $this->db->prepare('DELETE FROM users WHERE uid = ?');
        $stmt->execute([$uid]);

        Response::json(['success' => true]);
    }
}
