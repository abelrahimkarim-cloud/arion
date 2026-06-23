# Database Schema

## Tables

- `admins`
- `users`
- `customers`
- `categories`
- `products`
- `product_images`
- `product_variants`
- `orders`
- `order_items`
- `settings`

## Schema Overview

### admins

- `id`
- `name`
- `email`
- `password`
- `created_at`
- `updated_at`

### categories

- `id`
- `name`
- `slug`
- `description`
- `image`
- `created_at`
- `updated_at`

### products

- `id`
- `category_id`
- `name`
- `slug`
- `description`
- `price`
- `is_featured`
- `is_new`
- `is_best_seller`
- `created_at`
- `updated_at`

### product_images

- `id`
- `product_id`
- `path`
- `alt_text`
- `sort_order`

### product_variants

- `id`
- `product_id`
- `sku`
- `size`
- `color`
- `stock`
- `price`
- `created_at`
- `updated_at`

### customers

- `id`
- `name`
- `phone`
- `email`
- `city`
- `address`
- `created_at`
- `updated_at`

### orders

- `id`
- `customer_id`
- `variant_id`
- `status`
- `quantity`
- `total_price`
- `notes`
- `city`
- `address`
- `whatsapp_sent`
- `created_at`
- `updated_at`

### order_items

- `id`
- `order_id`
- `product_id`
- `variant_id`
- `quantity`
- `price`
- `created_at`
- `updated_at`

### settings

- `id`
- `store_name`
- `logo_url`
- `whatsapp_number`
- `seo_title`
- `seo_description`
- `facebook_url`
- `instagram_url`
- `twitter_url`
- `created_at`
- `updated_at`
