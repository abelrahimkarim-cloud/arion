'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import AdminTable from '@/components/admin/AdminTable';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminProductsPage() {
  useAdminAuthGuard();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await adminFetch('/api/admin/products');
        const result = await response.json();
        setProducts(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const rows = products.map((product) => [
    product.id,
    product.name,
    `$${product.price}`,
    product.category?.name || 'Uncategorized',
    product.show_on_homepage ? 'Yes' : 'No',
    <Link
      key={`${product.id}-edit`}
      href={`/admin/products/${product.id}`}
      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
    >
      Edit
    </Link>,
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Products</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Product management</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Add product
        </Link>
      </div>
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading products…
        </div>
      ) : (
        <AdminTable
          columns={['ID', 'Name', 'Price', 'Category', 'Homepage', 'Actions']}
          rows={rows}
          caption="Manage your catalog, update visibility, and edit product details."
        />
      )}
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <p className="text-sm text-slate-600">Note: Add product creation and image upload are not yet implemented in this admin panel.</p>
      </div>
      )}
    </div>
  );
}
