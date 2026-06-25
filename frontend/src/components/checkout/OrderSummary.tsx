'use client';

interface OrderSummaryProps {
  imageUrl: string | null;
  productName: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  subtotal: number;
  delivery: string;
  paymentMethod: string;
  total: number;
}

export default function OrderSummary({
  imageUrl,
  productName,
  price,
  color,
  size,
  quantity,
  subtotal,
  delivery,
  paymentMethod,
  total,
}: OrderSummaryProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-slate-100">
          {imageUrl ? (
            <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              No image
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Your order</p>
          <h2 className="text-lg font-semibold text-slate-900">{productName}</h2>
          <div className="text-sm text-slate-600">
            <p>
              Color: <span className="font-semibold text-slate-900">{color}</span>
            </p>
            <p>
              Size: <span className="font-semibold text-slate-900">{size}</span>
            </p>
            <p>
              Qty: <span className="font-semibold text-slate-900">{quantity}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
        <div className="flex justify-between">
          <span>Unit Price</span>
          <span className="font-semibold">{price.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">{subtotal.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="font-semibold">{delivery}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{total.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-200 text-sm text-slate-500">
          <span>Payment</span>
          <span>{paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}
