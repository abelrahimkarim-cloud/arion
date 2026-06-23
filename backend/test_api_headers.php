<?php

$loginData = json_encode(['email' => 'admin@example.com', 'password' => 'password']);

$ch = curl_init('http://127.0.0.1:8001/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$loginResponse = json_decode(curl_exec($ch), true);
curl_close($ch);

$token = $loginResponse['access_token'];

// Test with full headers
echo "=== TESTING POST /api/admin/products ===\n\n";

$productData = json_encode([
    'category_id' => 1,
    'name' => 'Test Product',
    'slug' => 'test-product-12345',
    'description' => 'Test',
    'price' => 50
]);

$ch = curl_init('http://127.0.0.1:8001/api/admin/products');

// Capture headers
$headers_array = [];
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

echo "HTTP Status: $httpCode\n\n";
echo "HEADERS:\n";
echo $headers . "\n\n";
echo "BODY:\n";
echo $body . "\n";
