'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import AdminSummaryCard from '@/components/admin/AdminSummaryCard';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

const dashboardDefaults = {
  ordersCount: 0,
  productsCount: 0,
  customersCount: 0,
  totalSales: 0,
};

export default function AdminDashboardPage() {
  useAdminAuthGuard();
  const [stats, setStats] = useState(dashboardDefaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await adminFetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to load dashboard');
        const data = await response.json();
        setStats({
          ordersCount: data.orders_count ?? 0,
          productsCount: data.products_count ?? 0,
          customersCount: data.customers_count ?? 0,
          totalSales: data.total_sales ?? 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Admin overview</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Manage products, categories, orders, customers, and storefront settings from one place.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AdminSummaryCard
          title="Orders"
          value={loading ? '…' : stats.ordersCount}
          description="Total orders placed."
        />
        <AdminSummaryCard
          title="Products"
          value={loading ? '…' : stats.productsCount}
          description="Active products in catalog."
        />
        <AdminSummaryCard
          title="Customers"
          value={loading ? '…' : stats.customersCount}
          description="Registered customers."
        />
        <AdminSummaryCard
          title="Revenue"
          value={loading ? '…' : `$${stats.totalSales}`}
          description="Completed sales value."
        />
      </div>
    </div>
  );
}
