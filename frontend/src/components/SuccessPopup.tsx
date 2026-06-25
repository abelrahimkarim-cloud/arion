'use client';

interface SuccessPopupProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function SuccessPopup({ open, onClose, onContinue }: SuccessPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:bg-slate-50"
          aria-label="Close success popup"
        >
          ✕
        </button>
        <div className="text-center">
          <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-orange-50 text-4xl leading-none text-orange-600">
            🎉
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Order Placed Successfully 🎉</h2>
          <p className="mt-3 text-sm text-slate-600">
            Thank you for your order. Our team will contact you soon to confirm your order.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-full bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            View More Products
          </button>
        </div>
      </div>
    </div>
  );
}
