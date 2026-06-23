<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@streetwear.local',
            'password' => Hash::make('Password123!'),
        ]);

        $categories = collect([
            ['name' => 'Menswear', 'slug' => 'menswear', 'description' => 'Streetwear essentials for men.', 'image' => '/images/categories/menswear.jpg'],
            ['name' => 'Womenswear', 'slug' => 'womenswear', 'description' => 'Premium female streetwear designs.', 'image' => '/images/categories/womenswear.jpg'],
            ['name' => 'Footwear', 'slug' => 'footwear', 'description' => 'Sneakers and trainers built for style.', 'image' => '/images/categories/footwear.jpg'],
        ]);

        $categories->each(fn($category) => Category::create($category));

        $defaultProducts = [
            [
                'name' => 'Icon Track Jacket',
                'slug' => 'icon-track-jacket',
                'category_slug' => 'menswear',
                'description' => 'Sleek technical jacket with premium streetwear details.',
                'price' => 85.00,
                'is_featured' => true,
                'is_new' => true,
                'is_best_seller' => true,
                'images' => [
                    '/images/products/jacket-1.jpg',
                    '/images/products/jacket-2.jpg',
                ],
                'variants' => [
                    ['sku' => 'JKT-BLK-S', 'size' => 'S', 'color' => 'Black', 'stock' => 12, 'price' => 85.00],
                    ['sku' => 'JKT-BLK-M', 'size' => 'M', 'color' => 'Black', 'stock' => 8, 'price' => 85.00],
                ],
            ],
            [
                'name' => 'Pulse Runner Sneakers',
                'slug' => 'pulse-runner-sneakers',
                'category_slug' => 'footwear',
                'description' => 'Lightweight runners with an elevated performance streetwear look.',
                'price' => 110.00,
                'is_featured' => true,
                'is_new' => false,
                'is_best_seller' => true,
                'images' => [
                    '/images/products/sneaker-1.jpg',
                    '/images/products/sneaker-2.jpg',
                ],
                'variants' => [
                    ['sku' => 'SNK-WHT-42', 'size' => '42', 'color' => 'White', 'stock' => 10, 'price' => 110.00],
                    ['sku' => 'SNK-BLK-43', 'size' => '43', 'color' => 'Black', 'stock' => 6, 'price' => 110.00],
                ],
            ],
        ];

        foreach ($defaultProducts as $productData) {
            $category = Category::where('slug', $productData['category_slug'])->first();
            $product = Product::create([
                'category_id' => $category->id,
                'name' => $productData['name'],
                'slug' => $productData['slug'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'is_featured' => $productData['is_featured'],
                'is_new' => $productData['is_new'],
                'is_best_seller' => $productData['is_best_seller'],
            ]);

            foreach ($productData['images'] as $index => $path) {
                ProductImage::create(['product_id' => $product->id, 'path' => $path, 'sort_order' => $index]);
            }

            foreach ($productData['variants'] as $variant) {
                ProductVariant::create(array_merge($variant, ['product_id' => $product->id]));
            }
        }

        Setting::create([
            'store_name' => 'Streetwear Studio',
            'logo_url' => '/images/logo.svg',
            'whatsapp_number' => '+1234567890',
            'seo_title' => 'Streetwear Studio | Premium Urban Apparel',
            'seo_description' => 'Shop streetwear essentials, sneakers, and workout gear with COD-only checkout.',
            'facebook_url' => 'https://facebook.com/streetwear',
            'instagram_url' => 'https://instagram.com/streetwear',
            'twitter_url' => 'https://twitter.com/streetwear',
        ]);
    }
}
