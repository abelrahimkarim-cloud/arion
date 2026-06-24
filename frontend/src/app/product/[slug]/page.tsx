'use client';

import React, { useEffect, useState } from 'react';
import ProductDetailTemu from '@/components/ProductDetailTemu';

type SizeOption = {
  label: string;
  available: boolean;
  stock: number;
};

type ColorVariation = {
  label: string;
  slug: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  sizes: SizeOption[];
};

type Product = {
  name: string;
  description: string;
  defaultPrice: number;
  defaultSalePrice?: number;
  sku: string;
  category: string;
  variations: ColorVariation[];
  related: { name: string; slug: string }[];
};

const sampleProduct: Product = {
  name: 'Icon Track Jacket',
  description:
    'A premium streetwear jacket engineered for movement with a sleek finish, breathable lining, and an elevated fit.',
  defaultPrice: 85,
  defaultSalePrice: 70,
  sku: 'NW-00984',
  category: 'Outerwear',
  variations: [
    {
      label: 'Black',
      slug: 'black',
      price: 85,
      salePrice: 70,
      stock: 4,
      images: ['/images/products/jacket-1.jpg', '/images/products/jacket-2.jpg'],
      sizes: [
        { label: 'S', available: true, stock: 2 },
        { label: 'M', available: true, stock: 1 },
        { label: 'L', available: true, stock: 0 },
        { label: 'XL', available: false, stock: 0 },
      ],
    },
    {
      label: 'White',
      slug: 'white',
      price: 85,
      stock: 8,
      images: ['/images/products/jacket-4.jpg', '/images/products/jacket-5.jpg'],
      sizes: [
        { label: 'S', available: true, stock: 3 },
        { label: 'M', available: true, stock: 3 },
        { label: 'L', available: true, stock: 2 },
        { label: 'XL', available: true, stock: 0 },
      ],
    },
    {
      label: 'Red',
      slug: 'red',
      price: 95,
      stock: 0,
      images: ['/images/products/jacket-3.jpg', '/images/products/jacket-6.jpg'],
      sizes: [
        { label: 'S', available: false, stock: 0 },
        { label: 'M', available: false, stock: 0 },
        { label: 'L', available: false, stock: 0 },
        { label: 'XL', available: false, stock: 0 },
      ],
    },
  ],
  related: [
    { name: 'Pulse Runner Sneakers', slug: 'pulse-runner-sneakers' },
    { name: 'Urban Cargo Shorts', slug: 'urban-cargo-shorts' },
  ],
};

export default function ProductPage({ params }: any) {
  const resolvedParams =
    params && typeof (params as any)?.then === 'function' ? React.use(params) : params;
  const { slug } = resolvedParams || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeImageUrl = (path: string, base: string) => {
    if (!path) return null;
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith('/storage/')) return `${base}${path}`;
    return `${base}/storage/${path.replace(/^\/+/, '')}`;
  };

  const getVariantImages = (variant: any, base: string, fallbackImages: string[]) => {
    if (!variant?.image) return fallbackImages;

    const source = variant.image;
    let images: string[] = [];

    if (typeof source === 'string') {
      try {
        const parsed = JSON.parse(source);
        if (Array.isArray(parsed)) {
          images = parsed.map((img) => String(img)).filter(Boolean);
        } else {
          images = [source];
        }
      } catch {
        images = [source];
      }
    }

    if (!images.length) {
      return fallbackImages;
    }

    const resolved = images
      .map((image) => normalizeImageUrl(image, base))
      .filter((url): url is string => Boolean(url));

    return resolved.length ? Array.from(new Set([...resolved, ...fallbackImages])) : fallbackImages;
  };

  useEffect(() => {
    if (!slug) {
      globalThis.setTimeout(() => {
        setProduct(sampleProduct);
        setLoading(false);
      }, 250);
      return;
    }

    const abort = new AbortController();
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
    const url = `${backend.replace(/\/$/, '')}/api/products/${encodeURIComponent(slug)}`;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: abort.signal });
        if (!res.ok) {
          setProduct(sampleProduct);
        } else {
          const data = await res.json();
          const base = backend.replace(/\/$/, '');
          const imageUrls: string[] = Array.isArray(data.images)
            ? data.images
                .map((img: any) => normalizeImageUrl(String(img.path || ''), base))
                .filter((url): url is string => Boolean(url))
            : [];

          const variants = Array.isArray(data.variants) ? data.variants : [];
          const variationMap: Record<string, ColorVariation> = {};

          variants.forEach((v: any) => {
            const colorKey = (v.color || 'default').toString();
            const sizeLabel = v.size ? v.size.toString().toUpperCase() : 'ONE';
            const priceNum = v.price ? Number(v.price) : Number(data.price || 0);
            const variantImages = getVariantImages(v, base, imageUrls);

            if (!variationMap[colorKey]) {
              variationMap[colorKey] = {
                label: colorKey,
                slug: colorKey.toLowerCase().replace(/\s+/g, '-'),
                price: priceNum,
                salePrice: undefined,
                stock: Number(v.stock || 0),
                images: variantImages,
                sizes: [
                  {
                    label: sizeLabel,
                    available: Number(v.stock || 0) > 0,
                    stock: Number(v.stock || 0),
                  },
                ],
              };
            } else {
              const existing = variationMap[colorKey];
              existing.sizes.push({
                label: sizeLabel,
                available: Number(v.stock || 0) > 0,
                stock: Number(v.stock || 0),
              });
              existing.stock = existing.stock + Number(v.stock || 0);
              existing.images = Array.from(new Set([...existing.images, ...variantImages, ...imageUrls]));
              if (!existing.salePrice && priceNum < existing.price) existing.salePrice = priceNum;
            }
          });

          const mappedProduct: Product = {
            name: data.name || 'Product',
            description: data.description || '',
            defaultPrice: Number(data.price || 0),
            defaultSalePrice: undefined,
            sku: data.sku || data.slug || '',
            category: data.category?.name || (data.category_id ? String(data.category_id) : ''),
            variations: Object.values(variationMap).length
              ? Object.values(variationMap)
              : [
                  {
                    label: 'Default',
                    slug: 'default',
                    price: Number(data.price || 0),
                    salePrice: undefined,
                    stock: 0,
                    images: imageUrls,
                    sizes: [],
                  },
                ],
            related: [],
          };

          setProduct(mappedProduct);
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        setProduct(sampleProduct);
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [slug]);

  const handleAddToCart = (color: string, size: string, quantity: number) => {
    console.log(`Added to cart: ${quantity}x ${color} - ${size}`);
    // TODO: Integrate with your cart system
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-64 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
        </div>
      </main>
    );
  }

  return product ? (
    <ProductDetailTemu product={product} onAddToCart={handleAddToCart} />
  ) : (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-600">Product not found</p>
    </main>
  );
}
