<?php
class Helper
{
    public static function base64URLEncoded($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
