<?php
include "./lib/response.php";
include "./lib/db.php";
include "./lib/helper.php";
include "./lib/jwt.php";
include "./lib/secret.php";

$URI = $_SERVER['REQUEST_URI'];

if ($URI === "/") {
    include './page/index.php';
}

if ($URI === "/delete") {
    include './page/delete.php';
}

if ($URI === "/profile") {
    include './page/profile.php';
}

if ($URI === "/update") {
    include './page/update.php';
}

if ($URI === "/search") {
    include './page/search.php';
}


if ($URI === "/login") {
    include './page/login.php';
}

if ($URI === "/register") {
    include './page/register.php';
}
