'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const defaultImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products');
        const data = await response.json();
        const productsData = data.data || data;
        const BACKEND_URL = 'http://127.0.0.1:8000';

        // Transform API response to match frontend expectations
        const transformedProducts = productsData.map((product) => ({
          ...product,
          image: product.images?.[0]?.path
            ? `${BACKEND_URL}/storage/${product.images[0].path.replace(/^\/+/, '')}`
            : defaultImage,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        }));

        setProducts(transformedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featured = products.filter((product) => product.show_on_homepage);

  useEffect(() => {
    if (featured.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featured.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [featured.length]);

  const product = featured[currentIndex];

  return (
    <main className="min-h-screen bg-surface text-brand">
      <section className="bg-brand text-white py-24 px-6 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                Built for street style
              </p>
              <h1 className="mt-6 text-5xl font-black leading-tight sm:text-6xl">
                Premium streetwear for every city move.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                Shop bold essentials, sleek silhouettes, and COD checkout for a fast, low-friction
                buying experience.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Shop the drop
                </Link>
              </div>
            </div>
            <div
              className="rounded-[2rem] bg-white p-6 shadow-soft lg:p-10"
              suppressHydrationWarning
            >
              <div className="relative" suppressHydrationWarning>
                {loading && (
                  <div className="flex items-center justify-center h-48 bg-slate-100 rounded-3xl">
                    <p className="text-slate-500">Loading products...</p>
                  </div>
                )}
                {!loading && product && (
                  <div suppressHydrationWarning>
                    <Link
                      href={`/product/${product.slug}`}
                      className="group block overflow-hidden rounded-3xl bg-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <img
                        src={imageErrors[product.id] ? defaultImage : product.image}
                        alt={product.name}
                        onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Featured
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900">
                          {product.name}
                        </h2>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm font-bold text-brand">${product.price}</p>
                          <button
                            className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/product/${product.slug}`;
                            }}
                          >
                            Shop
                          </button>
                        </div>
                      </div>
                    </Link>
                    {featured.length > 1 && (
                      <div className="mt-4 flex justify-center gap-2">
                        {featured.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 w-2 rounded-full transition ${
                              index === currentIndex ? 'bg-brand' : 'bg-slate-300'
                            }`}
                            aria-label={`Go to product ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!loading && !product && (
                  <div className="flex items-center justify-center h-48 bg-slate-100 rounded-3xl">
                    <p className="text-slate-500">No featured products available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-10 shadow-soft">
            <span className="text-sm uppercase tracking-[0.3em] text-accent">Why shop with us</span>
            <h2 className="mt-4 text-3xl font-semibold">Fast COD checkout</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Buy instantly without payment gateways, and pay when your order arrives.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-10 shadow-soft">
            <span className="text-sm uppercase tracking-[0.3em] text-accent">Built for impact</span>
            <h2 className="mt-4 text-3xl font-semibold">Premium streetwear vibes</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Modern silhouettes, rich fabrics, and urban details that convert.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-10 shadow-soft">
            <span className="text-sm uppercase tracking-[0.3em] text-accent">
              Always responsive
            </span>
            <h2 className="mt-4 text-3xl font-semibold">Designed for mobile</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              A smooth shopping experience for phones, tablets, and desktops.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-slate-950 py-20 px-6 text-white sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="uppercase tracking-[0.3em] text-accent">Customer reviews</p>
              <h2 className="mt-2 text-3xl font-semibold">Loved by the community</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-white/80 underline underline-offset-4"
            >
              Explore all products
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              'Clean fit and premium quality.',
              'Quick ordering, perfect delivery.',
              'The best COD experience I have used.',
            ].map((text, index) => (
              <div key={index} className="rounded-3xl bg-slate-900 p-8 shadow-soft">
                <p className="text-sm leading-7 text-slate-300">"{text}"</p>
                <p className="mt-6 font-semibold text-white">Jordan P.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <a
        href="https://wa.me/+1234567890"
        className="fixed right-6 bottom-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-xl hover:bg-red-500"
      >
        WhatsApp
      </a>
    </main>
  );
}
