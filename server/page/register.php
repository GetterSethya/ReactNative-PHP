<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message = "Berhasil membuat user";
    $data = $_POST;

    if (!(isset($_POST["email"]) && isset($_POST["name"]) && isset($_POST["password"]))) {
        die(AppResponse::json("Gagal membuat user", null, 400));
    }

    $db = new DB();
    $conn = $db->getConn();

    // jangan dicontohhhh!!!!
    $checkEmail = $conn->query("SELECT id FROM users WHERE email = '{$_POST["email"]}' LIMIT 1")->fetch_assoc();

    if ($checkEmail) {
        die(AppResponse::json("Email sudah terdaftar", null, 400, false));
    }

    $password_hash = password_hash($_POST["password"], PASSWORD_BCRYPT, []);

    // ini jangan dicontoh bjirrr!!!
    $sql = "INSERT INTO users SET 
            name = '{$_POST["name"]}',
            email = '{$_POST["email"]}',
            password_hash = '{$password_hash}'";

    // insert ke db
    if ($conn->query($sql)) {
        echo AppResponse::json("Success", $_POST);
    } else {
        echo AppResponse::json("Failed", null, 500);
    }
} else {
    echo AppResponse::json("Method is not allowed", null, 405);
}
