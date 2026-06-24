'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import AdminTable from '@/components/admin/AdminTable';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminCustomersPage() {
  useAdminAuthGuard();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await adminFetch('/api/admin/customers');
        const result = await response.json();
        setCustomers(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const rows = customers.map((customer) => [
    customer.id,
    customer.name,
    customer.email,
    customer.orders_count ?? customer.orders?.length ?? 0,
    <Link
      key={`customer-${customer.id}`}
      href={`/admin/customers/${customer.id}`}
      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
    >
      View
    </Link>,
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Customers</h1>
        <p className="mt-3 text-sm text-slate-600">
          View registered customers and their order counts.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading customers…
        </div>
      ) : (
        <AdminTable
          columns={['ID', 'Name', 'Email', 'Orders', 'Actions']}
          rows={rows}
          caption="Customer profiles and activity in the storefront."
        />
      )}
    </div>
  );
}
