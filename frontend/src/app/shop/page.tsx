import Link from 'next/link';

const products = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `Street Essential ${index + 1}`,
  slug: `street-essential-${index + 1}`,
  price: 45 + index * 12,
  image: '/images/products/card-1.jpg',
  badge: index % 2 === 0 ? 'New' : 'Popular',
}));

export default function ShopPage() {
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
          {products.map((product) => (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-soft transition hover:-translate-y-1"
            >
              <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
              <div className="p-6">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                  {product.badge}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-brand">{product.name}</h2>
                <p className="mt-3 text-lg font-bold text-accent">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
