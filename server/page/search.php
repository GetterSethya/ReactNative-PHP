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

    // SEARCH ALL TODO BY USER
    // Get todo by id (protect user)

    if (!(isset($_POST["search"]))) {
        die(AppResponse::json("search is required", null, 400));
    }

    // JANGAN DICONTOH BJIRRR!!!!
    $sql = "SELECT * FROM todos WHERE user_id={$validJWT["sub"]} AND (todo LIKE '%{$_POST['search']}%' OR status='{$_POST["search"]}') ORDER BY id";
    $result = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);

    echo AppResponse::json("success", $result);
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
