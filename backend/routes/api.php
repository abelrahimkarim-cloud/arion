<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ImageController;

Route::options('{any}', function () {
    return response()->noContent(204);
})->where('any', '.*');

Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{slug}', [ProductController::class, 'show']);
Route::post('orders', [OrderController::class, 'store']);

Route::middleware(['auth:api'])->prefix('admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::get('orders', [OrderController::class, 'adminIndex']);
    Route::patch('orders/{order}', [OrderController::class, 'updateStatus']);
    Route::get('products', [ProductController::class, 'adminIndex']);
    Route::get('products/{product}', [ProductController::class, 'adminShow']);
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy']);
    Route::post('products/upload-image', [ImageController::class, 'uploadProductImage']);
    Route::delete('products/delete-image', [ImageController::class, 'deleteProductImage']);
    Route::post('products/upload-image', [ImageController::class, 'uploadProductImage']);
    Route::delete('products/delete-image', [ImageController::class, 'deleteProductImage']);
    Route::get('categories', [CategoryController::class, 'adminIndex']);
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
    Route::get('customers', [CustomerController::class, 'index']);
    Route::get('settings', [SettingsController::class, 'show']);
    Route::post('settings', [SettingsController::class, 'update']);
});
