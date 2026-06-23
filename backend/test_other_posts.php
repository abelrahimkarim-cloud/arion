<?php

echo "=== Testing POST without token ===\n";
$ch = curl_init('http://127.0.0.1:8001/api/admin/products');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['name' => 'test']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_HEADER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
echo preg_replace('/\r\n/', '\n', substr($response, 0, 600)) . "\n\n";

echo "=== Testing POST to /api/categories (exists but different controller) ===\n";
$loginData = json_encode(['email' => 'admin@example.com', 'password' => 'password']);
$ch = curl_init('http://127.0.0.1:8001/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$loginResponse = json_decode(curl_exec($ch), true);
curl_close($ch);

$token = $loginResponse['access_token'];

$ch = curl_init('http://127.0.0.1:8001/api/admin/categories');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['name' => 'test', 'slug' => 'test']));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_HEADER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo preg_replace('/\r\n/', '\n', substr($response, 0, 600)) . "\n";
