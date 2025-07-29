// components/TokenRefreshHandler.tsx
'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function TokenRefreshHandler() {
  const { refresh, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) return;

    // Refresh token every 45 minutes (assuming 1-hour token expiry)
    const refreshInterval = setInterval(() => {
      refresh().catch(() => {
        // Handle refresh failure (already handled in useAuth hook)
      });
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, [refresh, isAuthenticated]);

  return null; // This component doesn't render anything
}
