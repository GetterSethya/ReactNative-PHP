<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message = "Berhasil login";
    $data = $_POST;

    if (!(isset($_POST["email"]) && isset($_POST["password"]))) {
        die(AppResponse::json("email/password salah", null, 400));
    }

    $db = new DB();
    $conn = $db->getConn();

    // jangan dicontohhhh!!!!
    $user = $conn->query("SELECT id,password_hash FROM users WHERE email = '{$_POST["email"]}' LIMIT 1")->fetch_assoc();

    if (!$user) {
        die(AppResponse::json("email/password salah", null, 400, false));
    }

    $valid = password_verify($_POST["password"], $user["password_hash"]);
    if ($valid) {
        $header = [
            "alg" => "HS256",
            "typ" => "JWT"
        ];

        $payload = [
            "sub" => $user["id"],
            "iat" => time(),
            "exp" => time() + 3600 * 24,
        ];

        $accessToken = JWT::create(
            $header,
            $payload,
            Secret::$accessSecret,
        );

        $response = [
            "accessToken" => $accessToken,
        ];

        echo AppResponse::json("user", $response);
    } else {
        die(AppResponse::json("email/password salah", null, 400, false));
    }
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
