<?php

namespace App\Modules\Auth\Controllers;

use App\Core\Database;
use App\Modules\GameTrack\Services\GameTrackSchema;
use App\Modules\User\Models\User;
use App\Modules\User\Models\UserDevice;
use App\Utils\JWT;
use App\Core\Response;
use PDO;

class AuthController
{
    private User $userModel;
    private UserDevice $userDeviceModel;

    public function __construct()
    {
        $this->userModel = new User();
        $this->userDeviceModel = new UserDevice();
    }

    public function register(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $username = trim($data['username'] ?? '');
        $email = trim($data['email'] ?? '');
        $displayName = trim($data['displayName'] ?? '') ?: $username;
        $favoriteGame = $data['favoriteGame'] ?? null;
        $avatar = $data['avatar'] ?? null;
        $password = (string) ($data['password'] ?? '');
        $dob = $data['dob'] ?? null;

        if ($username === '' || $email === '' || $password === '') {
            Response::error('username, email, and password are required', 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }

        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters', 400);
        }

        $db = Database::getConnection();
        GameTrackSchema::ensure($db);

        $stmt = $db->prepare('SELECT uid FROM users WHERE username = ? OR email = ?');
        $stmt->execute([$username, $email]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            Response::error('Username or email already exists', 409);
        }

        $uid = bin2hex(random_bytes(16));
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $age = null;
        if ($dob) {
            $age = date_diff(date_create($dob), date_create('today'))->y;
        }

        $stmt = $db->prepare(
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
            1,
            0,
            1000,
            'client',
        ]);

        $token = JWT::encode(['userId' => $uid, 'email' => $email]);

        Response::success([
            'user' => [
                'uid' => $uid,
                'username' => $username,
                'email' => $email,
                'displayName' => $displayName,
                'avatar' => $avatar,
                'dob' => $dob,
                'age' => $age,
                'favoriteGame' => $favoriteGame,
                'level' => 1,
                'xp' => 0,
                'nextLevelXp' => 1000,
                'role' => 'client',
            ],
            'token' => $token,
        ], 'User registered successfully', 201);
    }

    public function login(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        error_log(''. $data['login']);
        $login = trim($data['email'] ?? $data['login'] ?? $data['username'] ?? '');
        $password = (string) ($data['password'] ?? '');

        if ($login === '' || $password === '') {
            Response::error('Login and password are required', 400);
        }

        $db = Database::getConnection();
        GameTrackSchema::ensure($db);

        $stmt = $db->prepare(
            'SELECT uid, username, email, displayName, password, avatar, level, xp, nextLevelXp, role
             FROM users
             WHERE username = ? OR email = ?
             LIMIT 1'
        );
        $stmt->execute([$login, $login]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Invalid credentials', 401);
        }

        unset($user['password']);

        $token = JWT::encode(['userId' => $user['uid'], 'email' => $user['email']]);

        Response::success([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
    }

    public function me($currentUser): void
    {
        $user = $this->userModel->findById($currentUser->userId);
        if (!$user) {
            Response::error('User not found', 404);
        }

        unset($user['password']);
        Response::success($user);
    }

    public function changePassword($currentUser): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?: [];
        $currentPassword = (string) ($data['current_password'] ?? '');
        $newPassword = (string) ($data['new_password'] ?? '');

        if ($currentPassword === '' || $newPassword === '') {
            Response::error('Current password and new password are required', 400);
        }

        if (strlen($newPassword) < 6) {
            Response::error('New password must be at least 6 characters', 400);
        }

        $user = $this->userModel->findById($currentUser->userId);
        if (!$user) {
            Response::error('User not found', 404);
        }

        $isValid = $this->userModel->verifyPassword($currentPassword, $user['password'])
            || $this->userModel->verifyPassword(hash('sha256', $currentPassword), $user['password']);
        if (!$isValid) {
            Response::error('Current password is incorrect', 401);
        }

        $this->userModel->updatePassword($user['id'], $newPassword);
        Response::success(null, 'Password updated successfully');
    }

    public function resetPassword(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?: [];
        $email = trim((string) ($data['email'] ?? ''));
        $newPassword = (string) ($data['new_password'] ?? '');

        if ($email === '' || $newPassword === '') {
            Response::error('Email and new password are required', 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }

        if (strlen($newPassword) < 6) {
            Response::error('New password must be at least 6 characters', 400);
        }

        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            Response::error('User not found', 404);
        }

        $this->userModel->updatePassword($user['id'], $newPassword);
        Response::success(null, 'Password reset successfully');
    }
}
