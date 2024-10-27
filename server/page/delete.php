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
    // JANGAN DICONTOHHHH!!!!
    // baiknya prepared statement / inputnya disanitized
    if (!(isset($_POST["todo_id"]))) {
        die(AppResponse::json("todo_id is required", null, 400));
    }

    $sql = "DELETE FROM todos WHERE id={$_POST["todo_id"]} AND user_id={$validJWT["sub"]}";

    if ($conn->query($sql)) {
        echo AppResponse::json("Success", null, 200);
    } else {
        echo AppResponse::json("Failed", null, 500);
    }
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
