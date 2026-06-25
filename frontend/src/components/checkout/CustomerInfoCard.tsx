'use client';

interface CustomerInfoCardProps {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function CustomerInfoCard({
  name,
  phone,
  city,
  address,
  notes,
  onChange,
  errors,
}: CustomerInfoCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Delivery details</h2>
          <p className="text-sm text-slate-500">Enter your contact and delivery information.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Full Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-orange-500 focus:outline-none"
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Phone Number</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-orange-500 focus:outline-none"
            placeholder="+212 600 000 000"
          />
          {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone}</p>}
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">City</span>
            <input
              type="text"
              value={city}
              onChange={(e) => onChange('city', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-orange-500 focus:outline-none"
              placeholder="Casablanca"
            />
            {errors.city && <p className="mt-2 text-xs text-red-600">{errors.city}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Address</span>
            <input
              type="text"
              value={address}
              onChange={(e) => onChange('address', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-orange-500 focus:outline-none"
              placeholder="123 Boulevard Mohamed V"
            />
            {errors.address && <p className="mt-2 text-xs text-red-600">{errors.address}</p>}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Order Notes</span>
          <textarea
            value={notes}
            onChange={(e) => onChange('notes', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-orange-500 focus:outline-none"
            rows={4}
            placeholder="Call before delivery, leave at door, etc."
          />
        </label>
      </div>
    </div>
  );
}
