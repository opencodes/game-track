<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Modules\Auth\Controllers\AuthController;
use Dotenv\Dotenv;
use App\Core\Response;
use App\Modules\GameTrack\Controllers\GameUserController;
use App\Modules\GameTrack\Controllers\GameController;
use App\Modules\GameTrack\Controllers\AchievementController;
use App\Modules\GameTrack\Controllers\LeaderboardController;

ini_set('display_errors', '1');
ini_set('log_errors', '1');
ini_set('error_log', 'php://stderr');
error_reporting(E_ALL);

set_error_handler(function ($severity, $message, $file, $line) {
    error_log(sprintf('PHP error [%s] %s in %s:%d', $severity, $message, $file, $line));
    return false;
});

set_exception_handler(function (Throwable $e) {
    error_log(sprintf('Uncaught exception %s: %s in %s:%d', get_class($e), $e->getMessage(), $e->getFile(), $e->getLine()));
    error_log($e->getTraceAsString());
});

register_shutdown_function(function () {
    $err = error_get_last();
    if ($err) {
        error_log(sprintf('Shutdown error [%s] %s in %s:%d', $err['type'], $err['message'], $err['file'], $err['line']));
    }
});

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

$allowed_origins = array_filter(array_map('trim', explode(',', $_ENV['CORS_ORIGIN'] ?? '')));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$is_allowed = false;

if ($origin) {
    if (!$allowed_origins) {
        $is_allowed = true;
    } elseif (in_array($origin, $allowed_origins, true)) {
        $is_allowed = true;
    } else {
        $is_localhost_request = preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin);
        $localhost_allowed = in_array('http://localhost', $allowed_origins, true) || in_array('https://localhost', $allowed_origins, true);

        if ($is_localhost_request && $localhost_allowed) {
            $is_allowed = true;
        }
    }
}

if ($origin && $is_allowed) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);
error_log("Incoming request: $method $path");

try {
    if ($path === '/auth/login' && $method === 'POST') {
        (new AuthController())->login();
    } elseif ($path === '/auth/register' && $method === 'POST') {
        (new AuthController())->register();
    } elseif ($path === '/users' && $method === 'GET') {
        (new GameUserController())->list();
    } elseif ($path === '/users' && $method === 'POST') {
        (new GameUserController())->create();
    } elseif (preg_match('/^\/users\/([^\/]+)$/', $path, $m) && $method === 'GET') {
        (new GameUserController())->get($m[1]);
    } elseif (preg_match('/^\/users\/([^\/]+)$/', $path, $m) && $method === 'PUT') {
        (new GameUserController())->update($m[1]);
    } elseif (preg_match('/^\/users\/([^\/]+)$/', $path, $m) && $method === 'DELETE') {
        (new GameUserController())->delete($m[1]);
    } elseif (preg_match('/^\/games\/([^\/]+)$/', $path, $m) && $method === 'GET') {
        (new GameController())->list($m[1]);
    } elseif ($path === '/games' && $method === 'POST') {
        (new GameController())->create();
    } elseif (preg_match('/^\/games\/([^\/]+)$/', $path, $m) && $method === 'DELETE') {
        (new GameController())->delete($m[1]);
    } elseif (preg_match('/^\/achievements\/([^\/]+)$/', $path, $m) && $method === 'GET') {
        (new AchievementController())->list($m[1]);
    } elseif ($path === '/achievements' && $method === 'POST') {
        (new AchievementController())->create();
    } elseif (preg_match('/^\/achievements\/([^\/]+)$/', $path, $m) && $method === 'DELETE') {
        (new AchievementController())->delete($m[1]);
    } elseif ($path === '/leaderboard' && $method === 'GET') {
        (new LeaderboardController())->list();
    } else {
        Response::error('Route not found', 404);
    }
} catch (Throwable $e) {
    error_log(sprintf('Unhandled exception %s: %s', get_class($e), $e->getMessage()));
    Response::error('Server Error', 500);
}
