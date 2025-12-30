<?php
require '../../../config/config.php';
require '../../handlers/auth.php';
require '../../handlers/sql.construct.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$apiKey = isset($_SERVER['HTTP_API_KEY']) ? trim($_SERVER['HTTP_API_KEY']) : 
          (isset($_SERVER['API_KEY']) ? trim($_SERVER['API_KEY']) : null);

if (!empty($apiKey)) {
    $verify = new verefiKey($apiKey, $main_pdo);
    $verifyCode = $verify->apiVer();

    if ($verifyCode == "401") {
        echo json_encode(["status" => "401", "message" => "Unauthorized!"]);
        exit;
    }

    if ($verifyCode == "500") {
        echo json_encode(["status" => "500", "message" => "Internal Server Error!"]);
        exit;
    }
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (empty($data) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = $_GET;
}

$price_param = isset($data['price']) ? trim($data['price']) : null;
$popular_param = isset($data['popular']) ? trim($data['popular']) : null;
$data_param = isset($data['data']) ? trim($data['data']) : null;
$min_param = isset($data['min']) ? trim($data['min']) : null;
$max_param = isset($data['max']) ? trim($data['max']) : null;
$type_param_array = isset($data['type']) ? (array)$data['type'] : [];

try {
    $sql = new SQLConstruct($price_param, $popular_param, $data_param, $min_param, $max_param, $type_param_array);
    $result = $sql->build();
    
    $stmt = $main_pdo->prepare($result['sql']);
    $stmt->execute($result['params']);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($items as &$item) {
        $item['price'] = floatval($item['price']);
        $item['last_price'] = $item['last_price'] ? floatval($item['last_price']) : null;
        $item['rating'] = floatval($item['rating']);
        $item['buys'] = intval($item['buys']);
    }
    
    echo json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        "status" => "500", 
        "message" => "Database Error: " . $e->getMessage(),
        "sql_error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        "status" => "500", 
        "message" => "Internal Server Error: " . $e->getMessage()
    ]);
}