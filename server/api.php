<?php
// server/api.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$api_base = '/api';

// Simple router
if (strpos($path, $api_base) !== 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}

$route = substr($path, strlen($api_base));
$parts = explode('/', trim($route, '/'));

try {
    // GET /api/users/:uid
    if ($method === 'GET' && $parts[0] === 'users' && isset($parts[1])) {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE uid = ?');
        $stmt->execute([$parts[1]]);
        $user = $stmt->fetch();
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    }
    // POST /api/users
    elseif ($method === 'POST' && $parts[0] === 'users') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare('INSERT INTO users (uid, username, avatar, level, xp, nextLevelXp, age, favoriteGame, role) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
                               ON DUPLICATE KEY UPDATE username=?, avatar=?, level=?, xp=?, nextLevelXp=?, age=?, favoriteGame=?, role=?');
        $stmt->execute([
            $data['uid'], $data['username'], $data['avatar'], $data['level'], $data['xp'], $data['nextLevelXp'], $data['age'], $data['favoriteGame'], $data['role'],
            $data['username'], $data['avatar'], $data['level'], $data['xp'], $data['nextLevelXp'], $data['age'], $data['favoriteGame'], $data['role']
        ]);
        echo json_encode(['success' => true]);
    }
    // PUT /api/users/:uid
    elseif ($method === 'PUT' && $parts[0] === 'users' && isset($parts[1])) {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare('UPDATE users SET xp = ?, level = ?, nextLevelXp = ? WHERE uid = ?');
        $stmt->execute([$data['xp'], $data['level'], $data['nextLevelXp'], $parts[1]]);
        echo json_encode(['success' => true]);
    }
    // GET /api/games/:uid
    elseif ($method === 'GET' && $parts[0] === 'games' && isset($parts[1])) {
        $stmt = $pdo->prepare('SELECT * FROM games WHERE userId = ? ORDER BY date DESC');
        $stmt->execute([$parts[1]]);
        echo json_encode($stmt->fetchAll());
    }
    // POST /api/games
    elseif ($method === 'POST' && $parts[0] === 'games') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare('INSERT INTO games (userId, name, duration, date, xpEarned, levelAchieved, remark) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['userId'], $data['name'], $data['duration'], $data['date'], $data['xpEarned'], $data['levelAchieved'], $data['remark']
        ]);
        echo json_encode(['success' => true]);
    }
    // GET /api/achievements/:uid
    elseif ($method === 'GET' && $parts[0] === 'achievements' && isset($parts[1])) {
        $stmt = $pdo->prepare('SELECT * FROM achievements WHERE userId = ?');
        $stmt->execute([$parts[1]]);
        echo json_encode($stmt->fetchAll());
    }
    // POST /api/achievements
    elseif ($method === 'POST' && $parts[0] === 'achievements') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare('INSERT INTO achievements (userId, achievementId, name, description, icon, unlocked, date) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['userId'], $data['achievementId'], $data['name'], $data['description'], $data['icon'], $data['unlocked'], $data['date']
        ]);
        echo json_encode(['success' => true]);
    }
    // GET /api/leaderboard
    elseif ($method === 'GET' && $parts[0] === 'leaderboard') {
        $stmt = $pdo->query('SELECT username, avatar, level, xp FROM users ORDER BY level DESC, xp DESC LIMIT 10');
        echo json_encode($stmt->fetchAll());
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
