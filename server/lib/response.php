<?php
class AppResponse
{
    public static function json(string $message, $data, $code = 200)
    {
        header("Content-Type: application/json");
        http_response_code($code);
        $response = array("message" => $message, "data" => $data);

        return json_encode($response);
    }
}
