'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, BACKEND_URL } from '@/lib/adminAuth';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminProductDetailPage({ params }: any) {
  useAdminAuthGuard();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [mediaOpen, setMediaOpen] = useState(true);
  const variantListRef = useRef<HTMLDivElement | null>(null);
  const [variantExpanded, setVariantExpanded] = useState<boolean[]>([]);
  const [scrollToNewVariant, setScrollToNewVariant] = useState(false);

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
    images: [] as any[],
    variants: [] as any[],
  });
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'variants'>('basic');

  useEffect(() => {
    setVariantExpanded(() => form.variants.map(() => false));
  }, [form.variants.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          adminFetch('/api/admin/categories'),
          adminFetch(`/api/admin/products/${params.id}`),
        ]);
        // handle auth
        if (prodRes.status === 401) {
          router.replace('/admin/login');
          return;
        }

        const catData = await (catRes.ok ? catRes.json() : Promise.resolve([]));
        const prodData = await prodRes.json().catch(() => null);

        console.debug('admin: product response', { prodResStatus: prodRes.status, prodData });

        // normalize categories
        const categoriesArray = Array.isArray(catData) ? catData : catData?.data || [];
        setCategories(categoriesArray);

        if (!prodData) {
          setMessage('Unable to load product data');
          setProduct(null);
          return;
        }

        const prod = prodData.data || prodData;
        setProduct(prod);

        // normalize images and variants to ensure form fields are populated
        const images = Array.isArray(prod.images)
          ? prod.images.map((img: any) => ({
              path: img.path || '',
              alt_text: img.alt_text || '',
              is_default: Boolean(img.is_default || img.isDefault || false),
            }))
          : [];

        const variants = Array.isArray(prod.variants)
          ? prod.variants.map((v: any) => ({
              sku: v.sku || '',
              size: v.size || '',
              color: v.color || '',
              stock: String(v.stock ?? ''),
              price: String(v.price ?? ''),
              compare_price: String(v.compare_price ?? ''),
              is_default: Boolean(v.is_default),
              image: (() => {
                if (!v.image) return '';
                try {
                  const parsed = JSON.parse(v.image);
                  if (Array.isArray(parsed)) {
                    return parsed.length ? String(parsed[0]) : '';
                  }
                } catch (e) {
                  // ignore parse errors and use raw string
                }
                return String(v.image);
              })(),
            }))
          : [];

        setForm({
          name: prod.name || '',
          slug: prod.slug || '',
          category_id: String(prod.category_id ?? ''),
          description: prod.description || '',
          price: String(prod.price ?? ''),
          is_featured: prod.is_featured ?? false,
          is_new: prod.is_new ?? false,
          is_best_seller: prod.is_best_seller ?? false,
          show_on_homepage: prod.show_on_homepage ?? false,
          images,
          variants,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  const handleInputChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getPreviewUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/storage/')) {
      return `${BACKEND_URL}${path}`;
    }
    return `${BACKEND_URL}/storage/${path.replace(/^\/+/, '')}`;
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    const newImages = [...form.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const setDefaultImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, is_default: i === index })),
    }));
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

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const setVariantImage = (index: number, imagePath: string) => {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], image: imagePath };
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const setDefaultVariant = (index: number) => {
    const newVariants = form.variants.map((variant, idx) => ({
      ...variant,
      is_default: idx === index,
    }));
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const toggleVariantExpanded = (index: number) => {
    setVariantExpanded((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const addVariant = () => {
    const newVariant = {
      sku: '',
      size: '',
      color: '',
      stock: '',
      price: '',
      compare_price: '',
      is_default: false,
      image: '',
    };
    setForm((prev) => ({
      ...prev,
      variants: [newVariant, ...prev.variants],
    }));
    setVariantExpanded((prev) => [false, ...prev]);
    setScrollToNewVariant(true);
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    setVariantExpanded((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (scrollToNewVariant && variantListRef.current) {
      variantListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setScrollToNewVariant(false);
    }
  }, [scrollToNewVariant]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        category_id: Number.parseInt(form.category_id, 10),
        price: Number.parseFloat(form.price),
        images: form.images.filter((img) => img.path),
        variants: form.variants
          .filter((v) => v.sku)
          .map((v) => ({
            ...v,
            stock: v.stock !== '' ? Number.parseInt(v.stock, 10) : 0,
            price: v.price !== '' ? Number.parseFloat(v.price) : Number.parseFloat(form.price),
            image: v.image || null,
          })),
      };

      const response = await adminFetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('Product updated successfully.');
      } else {
        const result = await response.json();
        setMessage(result.message || 'Unable to update product.');
      }
    } catch (error) {
      setMessage('Unable to update product.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading product details…</div>;
  }

  if (!product) {
    return <div className="text-red-600">Product not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Edit product</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update product details, images, variants, and visibility settings.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm"
      >
        {/* Tabs */}
        <div className="mb-4">
          <nav className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'basic'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Basic information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'images'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Gallery of images
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('variants')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'variants'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Variants
            </button>
          </nav>
        </div>

        <div className="space-y-4 border-b border-slate-200 pb-6">
          {activeTab === 'basic' && (
            <>
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
            </>
          )}
        </div>

        {activeTab === 'basic' && (
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
        )}

        {activeTab === 'images' && (
          <div className="space-y-4 border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Images</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Manage your product media library here. Upload images once and reuse them for
                  variant assignments and storefront display.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMediaOpen((open) => !open)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  {mediaOpen ? 'Hide media' : 'Show media'}
                </button>
                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Upload More Images
                </button>
              </div>
            </div>

            {mediaOpen ? (
              <div className="space-y-4 pt-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  {form.images.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                      No images added yet. Click Upload More Images to add product media to the
                      gallery.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {form.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700">
                              Image {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200"
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
                          <div className="mt-3 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name={`default-image-${product?.id || 'new'}`}
                                checked={Boolean(image.is_default)}
                                onChange={() => setDefaultImage(index)}
                                className="h-4 w-4"
                              />
                              <span className="text-xs text-slate-600">Set as default</span>
                            </label>
                            {image.is_default && (
                              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                Default
                              </span>
                            )}
                          </div>
                          <label className="mt-4 block">
                            <span className="text-xs font-semibold text-slate-600">Alt text</span>
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
                  )}
                </div>
                {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'variants' && (
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
            <div className="space-y-4" ref={variantListRef}>
              {form.variants.map((variant, index) => {
                const expanded = variantExpanded[index] ?? false;
                const variantPreview = getPreviewUrl(variant.image);
                return (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border bg-slate-100">
                          {variantPreview ? (
                            <img
                              src={variantPreview}
                              alt={variant.color || 'Variant image'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">No image</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {variant.size || 'Size'} / {variant.color || 'Color'}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {variant.sku || 'SKU not set'}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {expanded
                              ? 'Variant details expanded'
                              : 'Click expand to edit variant details'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleVariantExpanded(index)}
                          className="rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {expanded ? 'Collapse' : 'Expand'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {expanded ? (
                      <div className="border-t border-slate-200 px-4 py-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <label className="block">
                            <span className="text-xs text-slate-500">Price</span>
                            <input
                              type="number"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                              placeholder="0.00"
                            />
                          </label>

                          <label className="block">
                            <span className="text-xs text-slate-500">Compare at price</span>
                            <input
                              type="number"
                              step="0.01"
                              value={variant.compare_price}
                              onChange={(e) =>
                                handleVariantChange(index, 'compare_price', e.target.value)
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                              placeholder="0.00"
                            />
                          </label>

                          <label className="block">
                            <span className="text-xs text-slate-500">Stock</span>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                              placeholder="0"
                              min="0"
                            />
                          </label>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          <label className="block">
                            <span className="text-xs text-slate-500">Size</span>
                            <input
                              type="text"
                              value={variant.size}
                              onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                              placeholder="XS, S, M, L"
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs text-slate-500">Color</span>
                            <input
                              type="text"
                              value={variant.color}
                              onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                              placeholder="Black, White"
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs text-slate-500">SKU</span>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
                              placeholder="SKU-001"
                            />
                          </label>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold text-slate-600">Variant image</p>
                          <div className="mt-2 flex flex-wrap gap-3">
                            {form.images.map((image, imageIndex) => {
                              const path = image.path;
                              const preview = getPreviewUrl(path);
                              const checked = variant.image === path;
                              return (
                                <label
                                  key={imageIndex}
                                  className="flex items-center gap-2 rounded-2xl border p-2"
                                >
                                  <input
                                    type="radio"
                                    name={`variant-image-${index}`}
                                    checked={checked}
                                    onChange={() => setVariantImage(index, path)}
                                    className="h-4 w-4"
                                  />
                                  {preview ? (
                                    <img
                                      src={preview}
                                      alt={image.alt_text || `Image ${imageIndex + 1}`}
                                      className="h-12 w-12 object-cover rounded"
                                    />
                                  ) : null}
                                  <span className="text-sm">
                                    {image.alt_text || `Image ${imageIndex + 1}`}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          {form.images.length === 0 && (
                            <p className="mt-2 text-xs text-slate-500">
                              Add product images first to assign a variant image.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {message && <p className="text-sm text-slate-700">{message}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Back to products
          </button>
        </div>
      </form>
    </div>
  );
}
