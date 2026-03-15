<?php

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

$uri = explode("/", trim($uri, "/"));

if ($uri[0] !== "api") {
    http_response_code(404);
    echo json_encode(["error" => "Invalid API"]);
    exit;
}

$resource = $uri[1] ?? null;
$id = $uri[2] ?? null;

switch ($resource) {

    case "users":
        require_once "./controllers/UserController.php";
        handleUsers($method, $id);
        break;

    case "games":
        require_once "../controllers/GameController.php";
        handleGames($method, $id);
        break;

    case "achievements":
        require_once "./controllers/AchievementController.php";
        handleAchievements($method, $id);
        break;

    case "leaderboard":
        require_once "./controllers/UserController.php";
        leaderboard();
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
}