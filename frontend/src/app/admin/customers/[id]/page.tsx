'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';
import { adminFetch } from '@/lib/adminAuth';

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  useAdminAuthGuard();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await adminFetch(`/api/admin/customers/${params.id}`);
        const result = await response.json();
        setCustomer(result.data || result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [params.id]);

  if (loading) {
    return <div className="text-slate-500">Loading customer details…</div>;
  }

  if (!customer) {
    return <div className="text-red-600">Customer not found.</div>;
  }

  return (
    <div className="space-y-8 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">{customer.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{customer.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Orders</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {customer.orders?.length ?? 0}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Registered</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
        <div className="mt-4 space-y-3">
          {customer.orders?.length > 0 ? (
            customer.orders.map((order: any) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Order #{order.id}</p>
                <p className="text-sm text-slate-600">
                  Total: ${order.total_amount} • {order.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
