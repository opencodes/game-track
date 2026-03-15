<?php
// server/config.php

$host = getenv('DB_HOST') ?: '193.203.184.158';
$db = getenv('DB_NAME') ?: 'u798926324_gaming';
$user = getenv('DB_USER') ?: 'u798926324_mysql_user';
$pass = getenv('DB_PASSWORD') ?: '$YYe*/yt5CAn/5#';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}

// Initialize tables if they don't exist
$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255),
        avatar TEXT,
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        nextLevelXp INT DEFAULT 1000,
        age INT DEFAULT 10,
        favoriteGame VARCHAR(255),
        role VARCHAR(50) DEFAULT 'client'
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255),
        name VARCHAR(255),
        duration INT,
        date DATE,
        xpEarned INT,
        levelAchieved INT,
        remark TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid)
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255),
        achievementId VARCHAR(50),
        name VARCHAR(255),
        description TEXT,
        icon VARCHAR(50),
        unlocked BOOLEAN DEFAULT TRUE,
        date DATE,
        FOREIGN KEY (userId) REFERENCES users(uid)
    )
");
