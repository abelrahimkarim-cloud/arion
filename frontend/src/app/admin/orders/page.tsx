'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import AdminTable from '@/components/admin/AdminTable';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminOrdersPage() {
  useAdminAuthGuard();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await adminFetch('/api/admin/orders');
        const result = await response.json();
        setOrders(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const rows = orders.map((order) => [
    order.id,
    order.customer?.name || 'Guest',
    `$${order.total_amount}`,
    order.status,
    <Link
      key={`order-${order.id}`}
      href={`/admin/orders/${order.id}`}
      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
    >
      View
    </Link>,
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-3 text-sm text-slate-600">View and manage customer orders.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading orders…
        </div>
      ) : (
        <AdminTable
          columns={['ID', 'Customer', 'Total', 'Status', 'Actions']}
          rows={rows}
          caption="Recent orders are listed for review and status updates."
        />
      )}
    </div>
  );
}
