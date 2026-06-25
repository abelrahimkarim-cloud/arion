export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
const ADMIN_TOKEN_KEY = 'streetwearAdminToken';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
  return token && token !== 'undefined' && token !== 'null' ? token : null;
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Add ngrok headers if using ngrok URL
  if (BACKEND_URL.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  const token = data.token ?? data.access_token;
  if (response.ok && token) {
    setAdminToken(token);
  }
  return data;
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Add ngrok headers if using ngrok URL
  if (BACKEND_URL.includes('ngrok')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });
}

export function adminLogout() {
  clearAdminToken();
}

export async function adminUploadImage(file: File) {
  const token = getAdminToken();
  if (!token) {
    return { success: false, message: 'Not authenticated' };
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/products/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Upload failed' };
  }
}
