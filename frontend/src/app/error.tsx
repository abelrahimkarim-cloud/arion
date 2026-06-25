'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface text-brand px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-slate-600 mb-8">Something went wrong</p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
