<?php
$main_host = "localhost";
$main_user = "root";
$main_pass = "root";
$main_db = "shop";

$main_pdo = new PDO(
    "mysql:host=$main_host;dbname=$main_db;charset=utf8mb4",
    $main_user,
    $main_pass, 
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => true,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);
?>