<?php
class SQLConstruct {
    public $sql = "SELECT * FROM items";
    public $execute = [];
    public $param_price;
    public $param_popular;
    public $param_data;
    public $param_min;
    public $param_max;
    public $param_type;

    public function __construct($param_price = null, $param_popular = null, $param_data = null, $param_min = null, $param_max = null, $param_type = []) {
        $this->param_price = $param_price;
        $this->param_popular = $param_popular;
        $this->param_data = $param_data;
        $this->param_min = $this->validateNumber($param_min);
        $this->param_max = $this->validateNumber($param_max);
        $this->param_type = is_array($param_type) ? $param_type : [];
    }

    private function validateNumber($value) {
        if ($value === null || $value === '') return null;
        return floatval($value);
    }

    public function paramWhere() {
        $conditions = [];

        if ($this->param_min !== null) {
            // Конвертируем строковое поле price в число для сравнения
            $conditions[] = "CAST(price AS DECIMAL(10,2)) >= ?";
            $this->execute[] = $this->param_min;
        }

        if ($this->param_max !== null) {
            // Конвертируем строковое поле price в число для сравнения
            $conditions[] = "CAST(price AS DECIMAL(10,2)) <= ?";
            $this->execute[] = $this->param_max;
        }

        if (!empty($this->param_type)) {
            $placeholders = implode(',', array_fill(0, count($this->param_type), '?'));
            $conditions[] = "type IN ($placeholders)";
            $this->execute = array_merge($this->execute, $this->param_type);
        }

        return $conditions;
    }

    public function paramOrder() {
        $orderClauses = [];
        
        if ($this->param_price === 'top') {
            $orderClauses[] = "CAST(price AS DECIMAL(10,2)) ASC";
        } elseif ($this->param_price === 'down') {
            $orderClauses[] = "CAST(price AS DECIMAL(10,2)) DESC";
        }

        if ($this->param_popular === 'top') {
            $orderClauses[] = "CAST(rating AS DECIMAL(3,2)) ASC";
        } elseif ($this->param_popular === 'down') {
            $orderClauses[] = "CAST(rating AS DECIMAL(3,2)) DESC";
        }
        
        if ($this->param_data === 'new') {
            $orderClauses[] = "data ASC";
        } elseif ($this->param_data === 'last') {
            $orderClauses[] = "data DESC";
        }

        return $orderClauses;
    }

    public function build() {
        $whereConditions = $this->paramWhere();
        $orderClauses = $this->paramOrder();

        if (!empty($whereConditions)) {
            $this->sql .= " WHERE " . implode(" AND ", $whereConditions);
        }

        if (!empty($orderClauses)) {
            $this->sql .= " ORDER BY " . implode(", ", $orderClauses);
        }

        $this->sql .= " LIMIT 20";

        return [
            'sql' => $this->sql,
            'params' => $this->execute
        ];
    }
}