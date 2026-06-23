'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, adminLogout } from '@/lib/adminAuth';
import AdminTable from '@/components/admin/AdminTable';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminCategoriesPage() {
  useAdminAuthGuard();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await adminFetch('/api/admin/categories');
        if (response.status === 401) {
          adminLogout();
          router.replace('/admin/login');
          return;
        }

        const result = await response.json();
        const categoriesArray = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];
        setCategories(categoriesArray);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [router]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      const createResponse = await adminFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name, slug: slugify(name) }),
      });
      if (!createResponse.ok) {
        if (createResponse.status === 401) {
          adminLogout();
          router.replace('/admin/login');
          return;
        }

        const errorResult = await createResponse.json().catch(() => null);
        console.error(
          'Category create failed',
          createResponse.status,
          createResponse.statusText,
          errorResult
        );
        return;
      }
      setName('');
      const response = await adminFetch('/api/admin/categories');
      const result = await response.json();
      const categoriesArray = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error(error);
    }
  };

  const rows = categories.map((category) => [
    category.id,
    category.name,
    category.products_count ?? category.products?.length ?? 0,
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Category management</h1>
        <p className="mt-3 text-sm text-slate-600">Create and review product categories.</p>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">New category</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
              required
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add category
          </button>
        </div>
      </form>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading categories…
        </div>
      ) : (
        <AdminTable
          columns={['ID', 'Name', 'Products']}
          rows={rows}
          caption="All categories are listed with associated product counts."
        />
      )}
    </div>
  );
}
