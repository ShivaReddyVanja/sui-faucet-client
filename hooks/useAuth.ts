// hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { refreshAccessToken } from '@/services/refreshToken';
import { toast } from 'sonner';

export function useAuth() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshAccessToken();
      
      // Update stored tokens
      localStorage.setItem('adminToken', result.accessToken);
      localStorage.setItem('walletAddress', result.user.walletAddress);
      
      toast.success('Session refreshed successfully');
      return result;
    } catch (error: any) {
      toast.error('Session expired', {
        description: 'Please login again'
      });
      
      // Clear tokens and redirect
      localStorage.removeItem('adminToken');
      localStorage.removeItem('walletAddress');
      window.location.href = '/admin/login';
      
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('walletAddress');
    window.location.href = '/admin/login';
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('adminToken');
  }, []);

  return {
    refresh,
    logout,
    isAuthenticated,
    isRefreshing,
  };
}
