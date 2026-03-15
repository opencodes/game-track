<?php

function handleGames($method, $userId)
{
    global $pdo;

    switch ($method) {

        // GET /api/games/:userId
        case "GET":

            if (!$userId) {
                http_response_code(400);
                echo json_encode(["error" => "UserId required"]);
                return;
            }

            $stmt = $pdo->prepare(
                "SELECT * FROM games
                 WHERE userId=?
                 ORDER BY date DESC"
            );

            $stmt->execute([$userId]);

            echo json_encode($stmt->fetchAll());

            break;


        // POST /api/games
        case "POST":

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $pdo->prepare(
                "INSERT INTO games
                (userId,name,duration,date,xpEarned,levelAchieved,remark)
                VALUES (?,?,?,?,?,?,?)"
            );

            $stmt->execute([
                $data["userId"],
                $data["name"],
                $data["duration"],
                $data["date"],
                $data["xpEarned"],
                $data["levelAchieved"],
                $data["remark"]
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Game session saved"
            ]);

            break;


        // DELETE /api/games/:id
        case "DELETE":

            $stmt = $pdo->prepare(
                "DELETE FROM games WHERE id=?"
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