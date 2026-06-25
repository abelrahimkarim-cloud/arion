'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearCart, getCart } from '@/lib/cart';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!customer.name.trim()) nextErrors.name = 'Name is required.';
    if (!customer.phone.trim()) nextErrors.phone = 'Phone is required.';
    if (!customer.city.trim()) nextErrors.city = 'City is required.';
    if (!customer.address.trim()) nextErrors.address = 'Address is required.';
    if (!cartItems.length) nextErrors.cart = 'Your cart is empty.';
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
          items: cartItems.map((item) => ({
            variant_id: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(result.message || 'Unable to place order. Please try again.');
        return;
      }

      clearCart();
      setCartItems([]);
      setCustomer({ name: '', phone: '', city: '', address: '', notes: '' });
      router.push(`/order-success?order_id=${result.order_id}`);
    } catch (error) {
      console.error(error);
      setSubmitError('Unable to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
              <p className="mt-2 text-sm text-slate-600">
                Confirm your order and delivery details. No popups or overlays.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Back to cart
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              <p className="text-lg font-semibold">Your cart is empty.</p>
              <p className="mt-2">Add an item before checking out.</p>
              <button
                type="button"
                onClick={() => router.push('/shop')}
                className="mt-6 inline-flex rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Shop products
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Review items</h2>
                  <div className="mt-4 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.variantId}
                        className="rounded-3xl bg-white p-4 shadow-sm sm:p-6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-3xl bg-slate-100">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                  No image
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                {item.productName}
                              </p>
                              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                {item.color} / {item.size}
                              </h3>
                              <p className="mt-2 text-sm text-slate-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-slate-600">
                            <p>
                              Unit:{' '}
                              <span className="font-semibold text-slate-900">
                                {item.price.toFixed(2)} MAD
                              </span>
                            </p>
                            <p className="mt-3 text-base font-semibold text-slate-900">
                              {(item.price * item.quantity).toFixed(2)} MAD
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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

                  {errors.cart ? (
                    <div className="rounded-3xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                      {errors.cart}
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

              <aside className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                    Order summary
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Total</h2>
                </div>
                <div className="space-y-3 rounded-3xl bg-white p-5 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} MAD</span>
                </div>
                <p className="text-sm text-slate-600">
                  Cash on delivery. We will contact you to confirm the order.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
