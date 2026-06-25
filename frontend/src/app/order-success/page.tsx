'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft text-center">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-700">
            ✓
          </div>
          <h1 className="text-4xl font-black text-slate-900">Order Confirmed</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Thank you for your purchase. Your order has been placed and is being prepared for
            delivery.
          </p>
          {orderId ? (
            <p className="mt-3 text-sm text-slate-500">
              Order number: <span className="font-semibold text-slate-900">#{orderId}</span>
            </p>
          ) : null}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Continue Shopping
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              View Cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
