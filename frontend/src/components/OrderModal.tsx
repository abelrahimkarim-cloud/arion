'use client';

import { useEffect } from 'react';
import OrderSummary from '@/components/checkout/OrderSummary';
import CustomerInfoCard from '@/components/checkout/CustomerInfoCard';

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  errorMessage: string | null;
  productName: string;
  imageUrl: string | null;
  price: number;
  color: string;
  size: string;
  quantity: number;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
  };
  errors: Record<string, string>;
  onCustomerChange: (field: string, value: string) => void;
  onQuantityChange: (quantity: number) => void;
}

export default function OrderModal({
  open,
  onClose,
  onConfirm,
  submitting,
  errorMessage,
  productName,
  imageUrl,
  price,
  color,
  size,
  quantity,
  customer,
  errors,
  onCustomerChange,
  onQuantityChange,
}: OrderModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const subtotal = price * quantity;
  const total = subtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center sm:px-6">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-transform duration-300 ease-out sm:scale-100 sm:rounded-[3rem]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Confirm Your Order</h2>
            <p className="text-sm text-slate-500">Review details and confirm your order.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:bg-slate-50"
            aria-label="Close order modal"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[1.05fr_0.95fr] sm:p-6">
          <div className="space-y-5">
            <OrderSummary
              imageUrl={imageUrl}
              productName={productName}
              price={price}
              color={color}
              size={size}
              quantity={quantity}
              subtotal={subtotal}
              delivery="Free"
              paymentMethod="Cash On Delivery (COD)"
              total={total}
            />

            <CustomerInfoCard
              name={customer.name}
              phone={customer.phone}
              city={customer.city}
              address={customer.address}
              notes={customer.notes}
              onChange={onCustomerChange}
              errors={errors}
            />
          </div>

          <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Order Summary</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Product Price</span>
                  <span>{price.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200 font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Customer Info</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Name:</span> {customer.name || '—'}</p>
                <p><span className="font-semibold text-slate-900">Phone:</span> {customer.phone || '—'}</p>
                <p><span className="font-semibold text-slate-900">City:</span> {customer.city || '—'}</p>
                <p><span className="font-semibold text-slate-900">Address:</span> {customer.address || '—'}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
              <p className="mt-3 text-sm text-slate-600">{customer.notes || 'No additional notes'}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          {errorMessage ? (
            <div className="mb-3 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Confirming…' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
