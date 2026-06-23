<?php

$url = 'http://127.0.0.1:8001/api/admin/products';
$options = [
    'http' => [
        'method' => 'GET',
        'header' => "Accept: application/json\r\n",
        'ignore_errors' => true,
    ],
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$status = $http_response_header[0] ?? 'NO_RESPONSE';
echo "STATUS: $status\n";
echo "BODY:\n";
echo $response . "\n";
