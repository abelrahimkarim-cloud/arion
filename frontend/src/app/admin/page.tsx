import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="rounded-[2rem] bg-slate-900 p-10 shadow-soft">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Admin Panel</p>
              <h1 className="mt-3 text-4xl font-black">Dashboard</h1>
            </div>
            <Link
              href="/admin/login"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Admin Login
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { label: 'Orders', value: '128', href: '/admin/orders' },
              { label: 'Revenue', value: '$24.7k', href: '/admin/orders' },
              { label: 'Customers', value: '56', href: '/admin/customers' },
            ].map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-3xl bg-slate-950 p-6 transition hover:bg-slate-800"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
