<?php

function handleAchievements($method, $userId)
{
    global $pdo;

    switch ($method) {

        // GET /api/achievements/:userId
        case "GET":

            if (!$userId) {
                http_response_code(400);
                echo json_encode(["error" => "UserId required"]);
                return;
            }

            $stmt = $pdo->prepare(
                "SELECT * FROM achievements
                 WHERE userId=?"
            );

            $stmt->execute([$userId]);

            echo json_encode($stmt->fetchAll());

            break;


        // POST /api/achievements
        case "POST":

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $pdo->prepare(
                "INSERT INTO achievements
                (userId,achievementId,name,description,icon,unlocked,date)
                VALUES (?,?,?,?,?,?,?)"
            );

            $stmt->execute([
                $data["userId"],
                $data["achievementId"],
                $data["name"],
                $data["description"],
                $data["icon"],
                $data["unlocked"],
                $data["date"]
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Achievement added"
            ]);

            break;


        // DELETE /api/achievements/:id
        case "DELETE":

            $stmt = $pdo->prepare(
                "DELETE FROM achievements
                 WHERE id=?"
            );

            $stmt->execute([$userId]);

            echo json_encode([
                "success" => true
            ]);

            break;


        default:

            http_response_code(405);
            echo json_encode([
                "error" => "Method not allowed"
            ]);
    }
}