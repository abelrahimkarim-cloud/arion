const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`
  : 'http://127.0.0.1:8000/api';

export async function fetcher<T>(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add ngrok headers if using ngrok URL
  if (process.env.NEXT_PUBLIC_BACKEND_URL?.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }

  return res.json() as Promise<T>;
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
