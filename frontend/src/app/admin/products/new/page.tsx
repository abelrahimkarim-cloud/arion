'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, adminLogout } from '@/lib/adminAuth';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminAddProductPage() {
  useAdminAuthGuard();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    price: '',
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    show_on_homepage: false,
    images: [{ path: '', alt_text: '' }],
    variants: [{ sku: '', size: '', color: '', stock: '', price: '', image: '' }],
  });

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'name') {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    const newImages = [...form.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { path: '', alt_text: '' }],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { sku: '', size: '', color: '', stock: '', price: '' }],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        category_id: parseInt(form.category_id),
        price: parseFloat(form.price),
        images: form.images.filter((img) => img.path),
        variants: form.variants
          .filter((v) => v.sku)
          .map((v) => ({
            ...v,
            stock: parseInt(v.stock),
            price: parseFloat(v.price),
          })),
      };

      const response = await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        adminLogout();
        router.replace('/admin/login');
        return;
      }

      if (response.ok) {
        setMessage('Product created successfully.');
        setTimeout(() => router.push('/admin/products'), 1500);
      } else {
        const result = await response.json();
        setMessage(result.message || 'Unable to create product.');
      }
    } catch (error) {
      setMessage('Unable to create product.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Add product</h1>
        <p className="mt-3 text-sm text-slate-600">
          Create a new product with images and variants.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm"
      >
        {/* Basic info */}
        <div className="space-y-4 border-b border-slate-200 pb-6">
          <h2 className="text-lg font-semibold text-slate-900">Basic information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <select
              value={form.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
              rows={4}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Price</span>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
              required
            />
          </label>
        </div>

        {/* Flags */}
        <div className="space-y-4 border-b border-slate-200 pb-6">
          <h2 className="text-lg font-semibold text-slate-900">Display settings</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.show_on_homepage}
                onChange={(e) => handleInputChange('show_on_homepage', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Show on homepage</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Featured product</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) => handleInputChange('is_new', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">New product</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_best_seller}
                onChange={(e) => handleInputChange('is_best_seller', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Best seller</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4 border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Images</h2>
            <button
              type="button"
              onClick={addImage}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Add image
            </button>
          </div>
          <div className="space-y-4">
            {form.images.map((image, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>

                <ImageUploadField
                  onImageUpload={(path, url) => handleImageChange(index, 'path', path)}
                  onError={(error) => setUploadError(error)}
                  existingImage={image.path}
                  label="Product image"
                  showPreview={true}
                />

                <label className="mt-4 block">
                  <span className="text-xs font-semibold text-slate-600">
                    Alt text (for accessibility)
                  </span>
                  <input
                    type="text"
                    value={image.alt_text}
                    onChange={(e) => handleImageChange(index, 'alt_text', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-slate-700"
                    placeholder="Describe the image"
                  />
                </label>
              </div>
            ))}
          </div>
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
        </div>

        {/* Variants */}
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Variants (sizes/colors)</h2>
            <button
              type="button"
              onClick={addVariant}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Add variant
            </button>
          </div>
          <div className="space-y-4">
            {form.variants.map((variant, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Variant {index + 1}:{' '}
                    {variant.size && variant.color ? `${variant.size} - ${variant.color}` : 'New'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">SKU</span>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-slate-700"
                      placeholder="SKU-001"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Size</span>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-slate-700"
                      placeholder="XS, S, M, L, XL"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Color</span>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-slate-700"
                      placeholder="Black, White, etc."
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Stock</span>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-slate-700"
                      placeholder="0"
                      min="0"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Price (override)</span>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-slate-700"
                      placeholder="Leave empty to use product price"
                      step="0.01"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <ImageUploadField
                    onImageUpload={(path, url) => handleVariantChange(index, 'image', path)}
                    onError={(error) => setUploadError(error)}
                    existingImage={variant.image}
                    label="Variant image (optional)"
                    showPreview={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {message && <p className="text-sm text-slate-700">{message}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
