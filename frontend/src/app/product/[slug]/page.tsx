'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

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
  // `params` may be a Promise in newer Next.js versions; unwrap with React.use()
  const resolvedParams =
    params && typeof (params as any)?.then === 'function' ? React.use(params) : params;
  const { slug } = resolvedParams || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('black');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // If a slug is provided, fetch product from backend API.
    // Fallback to `sampleProduct` when no slug or fetch fails.
    if (!slug) {
      const timer = window.setTimeout(() => {
        setProduct(sampleProduct);
        setLoading(false);
      }, 250);
      return () => window.clearTimeout(timer);
    }

    const abort = new AbortController();
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
    const url = `${backend.replace(/\/$/, '')}/api/products/${encodeURIComponent(slug)}`;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: abort.signal });
        if (!res.ok) {
          // fallback to sample product on error
          console.warn('Product fetch failed', res.status);
          setProduct(sampleProduct);
        } else {
          const data = await res.json();
          // map backend image paths to full storage URLs (Laravel public disk -> /storage/)
          try {
            const base = backend.replace(/\/$/, '');
            // Normalize backend response to our frontend `Product` shape
            const imageUrls: string[] = Array.isArray(data.images)
              ? data.images.map((img: any) =>
                  img.path && /^https?:\/\//.test(img.path)
                    ? img.path
                    : `${base}/storage/${img.path}`
                )
              : [];

            const variants = Array.isArray(data.variants) ? data.variants : [];
            // Group variants by color to build `variations`
            const variationMap: Record<string, ColorVariation> = {};

            variants.forEach((v: any) => {
              const colorKey = (v.color || 'default').toString();
              const sizeLabel = v.size ? v.size.toString().toUpperCase() : 'ONE';
              const priceNum = v.price ? Number(v.price) : Number(data.price || 0);
              if (!variationMap[colorKey]) {
                variationMap[colorKey] = {
                  label: colorKey,
                  slug: colorKey.toLowerCase().replace(/\s+/g, '-'),
                  price: priceNum,
                  salePrice: undefined,
                  stock: Number(v.stock || 0),
                  images: imageUrls.length ? imageUrls : [],
                  sizes: [
                    {
                      label: sizeLabel,
                      available: Number(v.stock || 0) > 0,
                      stock: Number(v.stock || 0),
                    },
                  ],
                };
              } else {
                // append size and accumulate stock
                const existing = variationMap[colorKey];
                existing.sizes.push({
                  label: sizeLabel,
                  available: Number(v.stock || 0) > 0,
                  stock: Number(v.stock || 0),
                });
                existing.stock = existing.stock + Number(v.stock || 0);
                // prefer lower price if exists
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
          } catch (mapErr) {
            console.error('Error mapping product response', mapErr);
            setProduct(data as Product);
          }
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [slug]);

  const selectedVariation = useMemo(() => {
    if (!product) return null;
    return (
      product.variations.find((variation) => variation.slug === selectedColor) ||
      product.variations[0]
    );
  }, [product, selectedColor]);

  useEffect(() => {
    if (!selectedVariation) return;
    const image = selectedVariation.images[0] || '';
    setActiveImage(image);
    const availableSize = selectedVariation.sizes.find(
      (size) => size.label === selectedSize && size.available
    );
    if (!availableSize) {
      setSelectedSize(null);
    }
  }, [selectedVariation]);

  const price = selectedVariation?.salePrice ?? selectedVariation?.price ?? product?.defaultPrice;
  const originalPrice = selectedVariation?.price ?? product?.defaultPrice;
  const discount = selectedVariation?.salePrice
    ? Math.round((1 - selectedVariation.salePrice / selectedVariation.price!) * 100)
    : 0;

  const stockState = useMemo(() => {
    if (!selectedVariation) return { label: 'Loading stock…', tone: 'text-slate-500', info: '' };
    if (selectedVariation.stock === 0) {
      return { label: 'Out of stock', tone: 'text-rose-600', info: '' };
    }
    if (selectedVariation.stock <= 5) {
      return { label: `Only ${selectedVariation.stock} left`, tone: 'text-amber-600', info: '' };
    }
    return { label: 'In stock', tone: 'text-emerald-700', info: '' };
  }, [selectedVariation]);

  const handleColorChange = (variation: ColorVariation) => {
    setSelectedColor(variation.slug);
  };

  const handleSizeChange = (size: SizeOption) => {
    if (!size.available) return;
    setSelectedSize(size.label);
  };

  const handleThumbnailClick = (image: string) => {
    setActiveImage(image);
    setImageLoaded(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const currentImages = selectedVariation?.images ?? [];

  return (
    <main className="min-h-screen bg-surface text-brand">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-accent">
            {product?.category ?? 'Outerwear'}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
              {loading ? (
                <div className="flex h-[520px] items-center justify-center bg-slate-100">
                  <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
                </div>
              ) : (
                <div
                  className="relative overflow-hidden bg-slate-100"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  {activeImage ? (
                    <>
                      <img
                        key={activeImage}
                        src={activeImage}
                        alt={`${product?.name} in ${selectedVariation?.label}`}
                        onLoad={() => setImageLoaded(true)}
                        className={`h-[520px] w-full object-cover transition-opacity duration-500 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={
                          isZoomed
                            ? {
                                transform: `scale(1.75) translate(-${zoomPosition.x / 4}%, -${zoomPosition.y / 4}%)`,
                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              }
                            : { transform: 'scale(1)' }
                        }
                      />
                      <span className="pointer-events-none absolute right-4 top-4 hidden rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm md:block">
                        Hover to zoom
                      </span>
                    </>
                  ) : (
                    <div className="flex h-[520px] items-center justify-center bg-slate-100 text-sm text-slate-500">
                      Image unavailable
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(loading ? Array.from({ length: 3 }) : currentImages).map((image, index) => (
                <button
                  key={loading ? index : image}
                  type="button"
                  onClick={() => !loading && handleThumbnailClick(image)}
                  className={`group overflow-hidden rounded-3xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                    !loading && image === activeImage
                      ? 'border-accent shadow-soft'
                      : 'border-slate-200'
                  } ${loading ? 'bg-slate-200' : 'bg-white'} h-28`}
                  aria-label={loading ? 'Loading thumbnail' : `Show image ${index + 1}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-full w-full animate-pulse bg-slate-200" />
                  ) : (
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-6 w-48 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.33em] text-slate-500">
                        {product?.sku}
                      </p>
                      <h1 className="mt-3 text-4xl font-black tracking-tight text-brand sm:text-5xl">
                        {product?.name}
                      </h1>
                    </div>
                    <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                      {selectedVariation?.label}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="flex items-end gap-4">
                      <p className="text-4xl font-black text-accent">${price?.toFixed(2)}</p>
                      {selectedVariation?.salePrice ? (
                        <p className="text-sm text-slate-500 line-through">
                          ${originalPrice?.toFixed(2)}
                        </p>
                      ) : null}
                    </div>
                    {discount > 0 ? (
                      <span className="rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700">
                        {discount}% off
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
                    {product?.description}
                  </p>

                  <div className="mt-8 space-y-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Color</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {product?.variations.map((variation) => {
                          const disabled = variation.stock === 0;
                          const active = selectedVariation?.slug === variation.slug;
                          return (
                            <button
                              key={variation.slug}
                              type="button"
                              onClick={() => handleColorChange(variation)}
                              disabled={disabled}
                              className={`rounded-full border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                                active
                                  ? 'border-accent bg-accent/10 text-accent'
                                  : 'border-slate-300 bg-white text-brand hover:border-accent'
                              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                              aria-pressed={active}
                            >
                              {variation.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Size</p>
                        <p className="text-sm text-slate-500">
                          {selectedSize ? `Selected: ${selectedSize}` : 'Select a size'}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {selectedVariation?.sizes.map((size) => (
                          <button
                            key={size.label}
                            type="button"
                            onClick={() => handleSizeChange(size)}
                            disabled={!size.available}
                            className={`rounded-full border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                              selectedSize === size.label
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-slate-300 bg-white text-brand hover:border-accent'
                            } ${!size.available ? 'cursor-not-allowed opacity-50' : ''}`}
                            aria-pressed={selectedSize === size.label}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                      <p className={`text-sm font-semibold ${stockState.tone}`}>
                        {stockState.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Ships from warehouse within 1-2 business days.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={selectedVariation?.stock === 0}
                      className={`w-full rounded-[1.5rem] px-6 py-4 text-base font-semibold text-white transition ${
                        selectedVariation?.stock === 0
                          ? 'cursor-not-allowed bg-slate-300'
                          : 'bg-accent hover:bg-accent-dark'
                      }`}
                    >
                      {selectedVariation?.stock === 0 ? 'Out of stock' : 'Add to cart'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
              <h2 className="text-2xl font-semibold">Related products</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product?.related.map((item) => (
                  <Link
                    href={`/product/${item.slug}`}
                    key={item.slug}
                    className="group rounded-3xl border border-slate-200 p-5 transition hover:shadow-lg"
                  >
                    <p className="font-semibold text-brand group-hover:text-accent">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Streetwear essentials made for city movement.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
