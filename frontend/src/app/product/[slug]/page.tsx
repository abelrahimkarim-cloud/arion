import Link from 'next/link';

export default function ProductPage({ params }: any) {
  const { slug } = params || {};

  return (
    <main className="min-h-screen bg-surface text-brand">
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-soft">
              <img
                src="/images/products/jacket-1.jpg"
                alt="Product image"
                className="h-[520px] w-full rounded-[2rem] object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                '/images/products/jacket-1.jpg',
                '/images/products/jacket-2.jpg',
                '/images/products/jacket-1.jpg',
              ].map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Gallery"
                  className="h-28 w-full rounded-3xl object-cover"
                />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white p-10 shadow-soft">
              <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-accent">
                {slug || 'Product'}
              </span>
              <h1 className="mt-4 text-4xl font-black">Icon Track Jacket</h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                A premium streetwear jacket made to look sharp and perform with core city energy.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <p className="text-3xl font-bold text-accent">$85.00</p>
                <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  In stock
                </span>
              </div>
              <div className="mt-10 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Size</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-brand transition hover:border-accent"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Color</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {['Black', 'White', 'Red'].map((color) => (
                      <button
                        key={color}
                        className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-brand transition hover:border-accent"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-10 shadow-soft">
              <h2 className="text-2xl font-semibold">Related products</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {['Pulse Runner Sneakers', 'Urban Cargo Shorts'].map((name) => (
                  <Link
                    href="/product/pulse-runner-sneakers"
                    key={name}
                    className="rounded-3xl border border-slate-200 p-4 transition hover:shadow-lg"
                  >
                    <p className="font-semibold text-brand">{name}</p>
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
