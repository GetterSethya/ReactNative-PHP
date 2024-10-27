<?php


if (!(isset($_SERVER["HTTP_AUTHORIZATION"]))) {
    die(AppResponse::json("unauthorized", null, 401));
}

$validJWT = JWT::validate($_SERVER["HTTP_AUTHORIZATION"], Secret::$accessSecret);

if (!$validJWT) {
    die(AppResponse::json("unauthorized", null, 401));
}

$db = new DB();
$conn = $db->getConn();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // UPDATE TODO (protect user)

    if (!isset($_POST["id"])) {
        die(AppResponse::json("id is required", null, 400));
    }

    if (!isset($_POST["todo"])) {
        die(AppResponse::json("todo is required", null, 400));
    }

    if (!isset($_POST["status"])) {
        die(AppResponse::json("status is required", null, 400));
    }

    $id = $_POST["id"];
    $todo = $_POST["todo"];
    $status = $_POST["status"];

    // ini jangan dicontoh bjirrr!!!
    $sql = "UPDATE todos 
            SET 
                todo = '{$todo}',
                status = '{$status}' 
            WHERE id = {$id} AND user_id = {$validJWT["sub"]}
    ";

    // insert ke db
    if ($conn->query($sql)) {
        echo AppResponse::json("Success", $_POST);
    } else {
        echo AppResponse::json("Failed", null, 500);
    }
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
