'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken } from './adminAuth';

export function useAdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace('/admin/login');
    }
  }, [router]);
}
