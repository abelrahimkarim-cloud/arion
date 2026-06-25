'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  useAdminAuthGuard();

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('New');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await adminFetch(`/api/admin/orders/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.message || 'Unable to load order.');
          return;
        }

        setOrder(result.data || result);
        setStatus(result.data?.status || result.status || 'New');
      } catch (err) {
        console.error(err);
        setError('Unable to load order.');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.id]);

  const handleStatusUpdate = async () => {
    if (!order) return;
    setUpdating(true);
    setError('');

    try {
      const response = await adminFetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || 'Unable to update status.');
        return;
      }
      setOrder(result);
    } catch (err) {
      console.error(err);
      setError('Unable to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading order details…
          </div>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            <p>Order not found.</p>
            <Link
              href="/admin/orders"
              className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const itemTotal = (item: any) => item.price * item.quantity;
  const quantityTotal =
    order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Order #{order.id}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Order details</h1>
                <p className="mt-2 text-sm text-slate-600">Customer and order item breakdown.</p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Back to orders
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-500">Status</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{order.status}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-500">Total</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {Number(order.total_price).toFixed(2)} MAD
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-500">Items</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {order.items?.length ?? 0}
                </p>
                <p className="text-sm text-slate-500">Qty: {quantityTotal}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Customer</h2>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">Name: </span>
                      {order.customer?.name}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Phone: </span>
                      {order.customer?.phone}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">City: </span>
                      {order.city}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Address: </span>
                      {order.address}
                    </p>
                    {order.notes ? (
                      <p>
                        <span className="font-semibold text-slate-900">Notes: </span>
                        {order.notes}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Order items</h2>
                  <div className="mt-4 space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                              {item.variant?.product?.name || 'Product'}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                              {item.variant?.color || 'Color'} / {item.variant?.size || 'Size'}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                              Unit price: {Number(item.price).toFixed(2)} MAD
                            </p>
                          </div>
                          <div className="space-y-2 text-right text-sm text-slate-600">
                            <p>Qty: {item.quantity}</p>
                            <p className="font-semibold text-slate-900">
                              Total: {itemTotal(item).toFixed(2)} MAD
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Update status</h2>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Order status
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-orange-500 focus:outline-none"
                    >
                      {['New', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
                        (option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                  {error ? (
                    <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Updating…' : 'Save status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
