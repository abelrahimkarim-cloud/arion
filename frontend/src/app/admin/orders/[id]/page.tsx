'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/adminAuth';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

const statuses = ['pending', 'processing', 'completed', 'cancelled'];

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  useAdminAuthGuard();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await adminFetch(`/api/admin/orders/${params.id}`);
        const result = await response.json();
        setOrder(result.data || result);
        setStatus(result.data?.status || result.status || 'pending');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.id]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await adminFetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading order details…</div>;
  }

  if (!order) {
    return <div className="text-red-600">Order not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Order #{order.id}</h1>
        <p className="mt-3 text-sm text-slate-600">Customer: {order.customer?.name || 'Guest'}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Items</h2>
          <div className="mt-4 space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{item.product_name}</p>
                <p className="text-sm text-slate-600">
                  Qty: {item.quantity} • ${item.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Order details</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd>${order.total_amount}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Status</dt>
              <dd>{order.status}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Created</dt>
              <dd>{new Date(order.created_at).toLocaleString()}</dd>
            </div>
          </dl>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Update status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
              >
                {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Update status'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
