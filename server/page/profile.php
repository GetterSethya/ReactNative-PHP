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

    // GET user by jwt
    // JANGAN DICONTOH BJIRRR!!!!
    $sql = "SELECT id,name,email FROM users WHERE id={$validJWT["sub"]} LIMIT 1";
    $result = $conn->query($sql)->fetch_assoc();

    echo AppResponse::json("success", $result);
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
