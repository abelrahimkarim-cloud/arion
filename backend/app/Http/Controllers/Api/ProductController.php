<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['images', 'variants', 'category']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }
        if ($request->filled('size')) {
            $query->whereHas('variants', fn($q) => $q->where('size', $request->size));
        }
        if ($request->filled('color')) {
            $query->whereHas('variants', fn($q) => $q->where('color', $request->color));
        }

        if ($request->filled('sort')) {
            match ($request->sort) {
                'price_asc' => $query->orderBy('price', 'asc'),
                'price_desc' => $query->orderBy('price', 'desc'),
                'popular' => $query->orderBy('is_best_seller', 'desc'),
                default => $query->orderBy('created_at', 'desc'),
            };
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(12)->withQueryString();
        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::with(['images', 'variants', 'category'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }

    public function adminIndex()
    {
        return response()->json(Product::with(['category', 'variants'])->orderBy('created_at', 'desc')->get());
    }

    public function adminShow(Product $product)
    {
        return response()->json($product->load(['images', 'variants', 'category']));
    }

    public function store(Request $request)
    {
        Log::info('ProductController store called', ['url' => $request->url()]);
        
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_best_seller' => 'boolean',
            'show_on_homepage' => 'boolean',
            'images' => 'array',
            'images.*.path' => 'required|string',
            'images.*.alt_text' => 'nullable|string',
            'variants' => 'array',
            'variants.*.sku' => 'required|string',
            'variants.*.size' => 'required|string',
            'variants.*.color' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.image' => 'nullable|string',
        ]);

        $product = Product::create($data);

        if (! empty($data['images'])) {
            foreach ($data['images'] as $index => $image) {
                ProductImage::create(array_merge($image, ['product_id' => $product->id, 'sort_order' => $index]));
            }
        }

        if (! empty($data['variants'])) {
            foreach ($data['variants'] as $variant) {
                // If the DB doesn't yet have an `image` column, remove it to avoid SQL errors.
                if (! Schema::hasColumn('product_variants', 'image')) {
                    unset($variant['image']);
                }
                ProductVariant::create(array_merge($variant, ['product_id' => $product->id]));
            }
        }

        return response()->json($product->load(['images', 'variants']), 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_best_seller' => 'boolean',
            'show_on_homepage' => 'boolean',
            'images' => 'array',
            'images.*.path' => 'required|string',
            'images.*.alt_text' => 'nullable|string',
            'variants' => 'array',
            'variants.*.sku' => 'required|string',
            'variants.*.size' => 'required|string',
            'variants.*.color' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.image' => 'nullable|string',
        ]);

        $product->update($data);

        if (isset($data['images'])) {
            $product->images()->delete();
            foreach ($data['images'] as $index => $image) {
                ProductImage::create(array_merge($image, ['product_id' => $product->id, 'sort_order' => $index]));
            }
        }

        if (isset($data['variants'])) {
            $product->variants()->delete();
            foreach ($data['variants'] as $variant) {
                if (! Schema::hasColumn('product_variants', 'image')) {
                    unset($variant['image']);
                }
                ProductVariant::create(array_merge($variant, ['product_id' => $product->id]));
            }
        }

        return response()->json($product->load(['images', 'variants']));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product removed']);
    }
}
