'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productName = searchParams.get('product_name') || '';
  const variantId = searchParams.get('variant_id') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const quantity = Number(searchParams.get('quantity') || '1');
  const price = Number(searchParams.get('price') || '0');
  const imageUrl = searchParams.get('image_url') || '';

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const subtotal = useMemo(() => price * quantity, [price, quantity]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!customer.name.trim()) nextErrors.name = 'Name is required.';
    if (!customer.phone.trim()) nextErrors.phone = 'Phone is required.';
    if (!customer.city.trim()) nextErrors.city = 'City is required.';
    if (!customer.address.trim()) nextErrors.address = 'Address is required.';
    if (!variantId) nextErrors.variant = 'Missing product details.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: keyof typeof customer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    if (!variantId) return;

    setSubmitting(true);

    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
      const url = `${backend.replace(/\/$/, '')}/api/orders`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          city: customer.city,
          address: customer.address,
          notes: customer.notes,
          variant_id: Number(variantId),
          quantity,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setSubmitError(result.message || 'Unable to place order. Please try again.');
        return;
      }

      setSuccess(true);
      setCustomer({ name: '', phone: '', city: '', address: '', notes: '' });
    } catch (error) {
      console.error(error);
      setSubmitError('Unable to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
          <div className="rounded-[2rem] bg-white p-10 shadow-soft text-center">
            <h1 className="text-3xl font-black">Order Placed</h1>
            <p className="mt-4 text-slate-600">Thank you! Your order has been received.</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-8 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Continue Shopping
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-black">Checkout</h1>
          <p className="mt-4 text-slate-600">
            Please confirm your order details and delivery information.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            >
              ← Back to order
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-3xl bg-white">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Product</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {productName || 'Product'}
                    </h2>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p>
                        Color: <span className="font-semibold text-slate-900">{color || '—'}</span>
                      </p>
                      <p>
                        Size: <span className="font-semibold text-slate-900">{size || '—'}</span>
                      </p>
                      <p>
                        Qty: <span className="font-semibold text-slate-900">{quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Full Name</span>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Phone Number</span>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                      placeholder="+212 600 000 000"
                    />
                    {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone}</p>}
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">City</span>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                      placeholder="Casablanca"
                    />
                    {errors.city && <p className="mt-2 text-xs text-red-600">{errors.city}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Address</span>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                      placeholder="123 Boulevard Mohamed V"
                    />
                    {errors.address && (
                      <p className="mt-2 text-xs text-red-600">{errors.address}</p>
                    )}
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Order Notes</span>
                  <textarea
                    value={customer.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                    rows={4}
                    placeholder="Any delivery notes?"
                  />
                </label>

                {submitError ? (
                  <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-orange-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Placing order…' : 'Place Order'}
                </button>
              </form>
            </div>

            <aside className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Unit price</span>
                    <span>{price.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Quantity</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>{subtotal.toFixed(2)} MAD</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Delivery</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Cash on delivery. We will contact you to confirm the order.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
