<?php
class DB
{
    private $SERVER_NAME = "localhost";
    private $USERNAME = "root";
    private $PASSWORD = "root";
    private $DATABASE_NAME = "todo_app";
    private ?mysqli $conn = null;

    public function __construct()
    {
        $this->connect();
    }

    public function connect()
    {
        try {
            $this->conn = new mysqli(
                $this->SERVER_NAME,
                $this->USERNAME,
                $this->PASSWORD,
                $this->DATABASE_NAME
            );

            if ($this->conn->connect_error) {
                throw new Exception("Connection failed:" . $this->conn->connect_error);
            }

            $this->conn->set_charset("utf8mb4");

            return $this->conn;
        } catch (Exception $e) {
            die("Database conn err:" . $e->getMessage());
        }
    }
    public function query($sql, $params = [])
    {
        try {
            $stmt = $this->conn->prepare($sql);

            if ($stmt === false) {
                throw new Exception("Query preparation failed: " . $this->conn->error);
            }

            if (!empty($params)) {
                $types = str_repeat('s', count($params));
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            return $stmt->get_result();
        } catch (Exception $e) {
            die("Query execution error: " . $e->getMessage());
        }
    }

    public function getConn()
    {
        return $this->conn;
    }

    public function close()
    {
        if ($this->conn) {
            $this->conn->close();
        }
    }

    public function __destruct()
    {
        $this->close();
    }
}
