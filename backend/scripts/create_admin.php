<?php
// One-off script to create a test admin user without tinker.
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Admin;

$email = 'admin@example.com';
$password = 'password';

$admin = Admin::where('email', $email)->first();
if ($admin) {
    echo "Admin already exists: {$email}\n";
    exit(0);
}

$created = Admin::create([
    'name' => 'Admin',
    'email' => $email,
    'password' => bcrypt($password),
]);

if ($created) {
    echo "Admin created: {$email} (password: {$password})\n";
    exit(0);
}

echo "Failed to create admin\n";
exit(1);
