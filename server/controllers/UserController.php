<?php

function handleUsers($method, $id)
{
    global $pdo;

    switch ($method) {

        case "GET":

            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE uid=?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch());
            } else {
                $stmt = $pdo->query("SELECT * FROM users");
                echo json_encode($stmt->fetchAll());
            }

            break;

        case "POST":

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $pdo->prepare(
                "INSERT INTO users(uid,username,level,xp)
                 VALUES(?,?,?,?)"
            );

            $stmt->execute([
                $data["uid"],
                $data["username"],
                $data["level"],
                $data["xp"]
            ]);

            echo json_encode(["success" => true]);

            break;

        case "PUT":

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $pdo->prepare(
                "UPDATE users SET xp=?,level=? WHERE uid=?"
            );

            $stmt->execute([
                $data["xp"],
                $data["level"],
                $id
            ]);

            echo json_encode(["success" => true]);

            break;

        case "DELETE":

            $stmt = $pdo->prepare("DELETE FROM users WHERE uid=?");
            $stmt->execute([$id]);

            echo json_encode(["success" => true]);

            break;
    }
}

function leaderboard()
{
    global $pdo;

    $stmt = $pdo->query(
        "SELECT username,avatar,level,xp
         FROM users
         ORDER BY level DESC,xp DESC
         LIMIT 10"
    );

    echo json_encode($stmt->fetchAll());
}