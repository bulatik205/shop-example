<?php
class verefiKey {
    public $key;
    public $pdo;

    function __construct($key, $pdo) {
        $this->key = $key;
        $this->pdo = $pdo;
    }

    function apiVer() {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM api_keys WHERE api_key = ?");
            $stmt->execute([$this->key]);
            $data = $stmt->fetchAll();

            if (!empty($data)) {
                return "200";
            } else {
                return "401";
            }
        } catch (Exception $e) {
            return "500";
        }
    }
}