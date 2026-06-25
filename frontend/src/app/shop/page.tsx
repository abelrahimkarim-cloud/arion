'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadImageAsBlob } from '@/lib/imageLoader';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  const defaultImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
        const headers: Record<string, string> = {};

        // Add ngrok headers if using ngrok URL
        if (BACKEND_URL.includes('ngrok')) {
          headers['ngrok-skip-browser-warning'] = 'true';
        }

        const res = await fetch(`${BACKEND_URL}/api/products`, { headers });
        const data = await res.json();
        const productsData = data.data || data;

        const transformed = productsData.map((product: any) => {
          const defaultImg = Array.isArray(product.images)
            ? product.images.find((i: any) => i.is_default) || product.images[0]
            : null;
          return {
            ...product,
            image:
              defaultImg && defaultImg.path
                ? `${BACKEND_URL}/storage/${defaultImg.path.replace(/^\/+/, '')}`
                : defaultImage,
            price:
              typeof product.price === 'string' ? Number.parseFloat(product.price) : product.price,
            badge: product.is_new ? 'New' : product.is_best_seller ? 'Popular' : '',
          };
        });

        setProducts(transformed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load images with proper headers for mobile/4G access
  useEffect(() => {
    if (products.length === 0) return;

    const loadImages = async () => {
      const cache: Record<string, string> = {};
      for (const product of products) {
        if (product.image && !product.image.startsWith('data:')) {
          try {
            cache[product.id] = await loadImageAsBlob(product.image);
          } catch (error) {
            console.error(`Failed to load image for product ${product.id}:`, error);
          }
        } else {
          cache[product.id] = product.image;
        }
      }
      setImageCache(cache);
    };

    loadImages();
  }, [products]);

  return (
    <main className="min-h-screen bg-surface text-brand">
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Shop</p>
            <h1 className="mt-2 text-4xl font-black">Browse our curated streetwear edit</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Search products"
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-accent focus:outline-none sm:w-72"
            />
            <button className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
              Filter
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {loading ? (
            <div className="col-span-3 text-center text-slate-500">Loading products…</div>
          ) : (
            products.map((product) => (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-soft transition hover:-translate-y-1"
              >
                <img
                  src={imageCache[product.id] || product.image}
                  alt={product.name}
                  className="h-72 w-full object-cover"
                />
                <div className="p-6">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                    {product.badge}
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-brand">{product.name}</h2>
                  <p className="mt-3 text-lg font-bold text-accent">${product.price}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
