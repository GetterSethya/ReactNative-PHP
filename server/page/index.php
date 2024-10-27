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


if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // LIST ALL TODO BY USER
    // Get todo by id (protect user)

    // JANGAN DICONTOH BJIRRR!!!!
    $sql = "SELECT * FROM todos WHERE user_id={$validJWT["sub"]} ORDER BY id";
    $result = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);

    echo AppResponse::json("index", $result);
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // CREATE TODO
    if (!isset($_POST["todo"])) {
        die(AppResponse::json("todo is required", null, 400));
    }

    $todo = $_POST["todo"];

    // ini jangan dicontoh bjirrr!!!
    $sql = "INSERT INTO todos SET 
            todo = '{$todo}',
            user_id = '{$validJWT["sub"]}'";

    // insert ke db
    if ($conn->query($sql)) {
        echo AppResponse::json("Success", null, 201);
    } else {
        echo AppResponse::json("Failed", null, 500);
    }
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
