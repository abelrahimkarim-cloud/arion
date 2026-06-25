'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CartItem, clearCart, getCart, removeCartItem, updateCartItemQuantity } from '@/lib/cart';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleQuantityChange = (variantId: number, nextQuantity: number) => {
    const updated = updateCartItemQuantity(variantId, nextQuantity);
    setCartItems(updated);
  };

  const handleRemove = (variantId: number) => {
    const updated = removeCartItem(variantId);
    setCartItems(updated);
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Your Cart</h1>
              <p className="mt-2 text-sm text-slate-600">
                Review your selected items before checkout. Your cart is saved in the browser.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push('/shop')}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={handleClearCart}
                disabled={cartItems.length === 0}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              <p className="text-lg font-semibold">Your cart is empty.</p>
              <p className="mt-3">Add a product to continue.</p>
              <Link
                href="/shop"
                className="mt-6 inline-flex rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-24 w-24 overflow-hidden rounded-3xl bg-white">
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
                          <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">
                            {item.productName}
                          </p>
                          <h2 className="mt-2 text-lg font-semibold text-slate-900">
                            {item.color} / {item.size}
                          </h2>
                          <p className="mt-2 text-sm text-slate-600">
                            Unit price:{' '}
                            <span className="font-semibold">{item.price.toFixed(2)} MAD</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 items-start sm:items-end">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                            className="h-9 w-9 rounded-full border border-slate-300 text-slate-700 transition hover:border-orange-300"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                            className="h-9 w-9 rounded-full border border-slate-300 text-slate-700 transition hover:border-orange-300"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.variantId)}
                          className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                        >
                          Remove
                        </button>
                        <p className="text-sm text-slate-600">
                          Total:{' '}
                          <span className="font-semibold text-slate-900">
                            {(item.price * item.quantity).toFixed(2)} MAD
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                    Order summary
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Total</h2>
                </div>
                <div className="space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
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
                  <span>{totalAmount.toFixed(2)} MAD</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-orange-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Continue to checkout
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
