import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
}
