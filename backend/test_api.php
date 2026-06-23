<?php

// First, get token
$loginData = json_encode([
    'email' => 'admin@example.com',
    'password' => 'password'
]);

$ch = curl_init('http://127.0.0.1:8001/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$loginResponse = json_decode(curl_exec($ch), true);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "LOGIN RESPONSE (HTTP $httpCode):\n";
echo json_encode($loginResponse, JSON_PRETTY_PRINT) . "\n\n";

if (!isset($loginResponse['access_token'])) {
    echo "Failed to get token\n";
    exit;
}

$token = $loginResponse['access_token'];

// Now test create product
$productData = json_encode([
    'category_id' => 1,
    'name' => 'Example Product',
    'slug' => 'example-product',
    'description' => 'A sample product description.',
    'price' => 99.99,
    'is_featured' => true,
    'is_new' => true,
    'is_best_seller' => false,
    'images' => [
        [
            'path' => 'https://example.com/image1.jpg',
            'alt_text' => 'Front view'
        ]
    ],
    'variants' => [
        [
            'sku' => 'SKU-001',
            'size' => 'M',
            'color' => 'Black',
            'stock' => 10,
            'price' => 99.99
        ]
    ]
]);

$ch = curl_init('http://127.0.0.1:8001/api/admin/products');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
$productResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "CREATE PRODUCT RESPONSE (HTTP $httpCode):\n";
echo $productResponse . "\n";

// Try to parse as JSON
$decoded = json_decode($productResponse, true);
if ($decoded) {
    echo "\nDECODED:\n";
    echo json_encode($decoded, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "\nNOT JSON - RAW RESPONSE:\n";
    echo $productResponse . "\n";
}
