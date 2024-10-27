<?php

class JWT
{

    public static function create($header, $payload, $secret)
    {
        $headerEncoded = Helper::base64URLEncoded(json_encode($header));
        $payloadEncoded = Helper::base64URLEncoded(json_encode($payload));
        $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secret, true);
        $signatureEncoded = Helper::base64URLEncoded($signature);

        return "$headerEncoded.$payloadEncoded.$signatureEncoded";
    }

    public static function validate($token, $secret)
    {
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode(".", $token);

        $signature = hash_hmac("sha256", "$headerEncoded.$payloadEncoded", $secret, true);
        $signatureEncodedCheck = Helper::base64URLEncoded($signature);

        if ($signatureEncoded !== $signatureEncodedCheck) {
            return false;
        }

        $payload = json_decode(base64_decode($payloadEncoded), true);

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }
}
