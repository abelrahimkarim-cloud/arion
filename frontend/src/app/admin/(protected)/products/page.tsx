'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, adminLogout, BACKEND_URL } from '@/lib/adminAuth';
import AdminTable from '@/components/admin/AdminTable';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminProductsPage() {
  useAdminAuthGuard();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await adminFetch('/api/admin/products');
        if (response.status === 401) {
          adminLogout();
          router.replace('/admin/login');
          return;
        }
        const result = await response.json();
        const productsData = Array.isArray(result) ? result : result.data || [];
        setProducts(productsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  const defaultImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';

  const rows = products.map((product) => {
    const defaultImg = Array.isArray(product.images)
      ? product.images.find((i: any) => i.is_default) || product.images[0]
      : null;
    const imageUrl =
      defaultImg && defaultImg.path
        ? `${BACKEND_URL}/storage/${defaultImg.path.replace(/^\/+/, '')}`
        : defaultImage;

    return [
      <img
        key={`img-${product.id}`}
        src={imageUrl}
        alt={product.name}
        className="h-12 w-12 rounded object-cover"
      />,
      product.id,
      product.name,
      `$${product.price}`,
      product.category?.name || 'Uncategorized',
      product.show_on_homepage ? 'Yes' : 'No',
      <div className="flex flex-wrap gap-2" key="actions">
        <Link
          key={`${product.id}-edit`}
          href={`/admin/products/${product.id}`}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Edit
        </Link>
        <Link
          key={`${product.id}-view`}
          href={`/product/${product.slug}`}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-900 hover:text-slate-900"
        >
          View
        </Link>
      </div>,
    ];
  });

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
          columns={['Image', 'ID', 'Name', 'Price', 'Category', 'Homepage', 'Actions']}
          rows={rows}
          caption="Manage your catalog, update visibility, and edit product details."
        />
      )}
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <p className="text-sm text-slate-600">
          Note: Add product creation and image upload are not yet implemented in this admin panel.
        </p>
      </div>
    </div>
  );
}
