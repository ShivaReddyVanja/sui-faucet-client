'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import axios from 'axios';

interface User {
  walletAddress: string;
  role: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {},
});

// Create axios instance with interceptors
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

// Add request interceptor to include access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected, account, signMessage, disconnect } = useWallet();

  const isAuthenticated = !!user && connected;

  const generateLoginMessage = (walletAddress: string) => {
    const timestamp = Date.now();
    return `SuiFaucetAdminLogin_${timestamp}_${walletAddress}`;
  };

  const login = async () => {
    try {
      if (!connected || !account?.address) {
        throw new Error('Wallet not connected');
      }

      const message = generateLoginMessage(account.address);
      
      // Sign the message
      const signature = await signMessage({
        message: new TextEncoder().encode(message),
      });

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      // Send login request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/login`,
        {
          walletAddress: account.address,
          message,
          signature: signature.signature,
        },
        { withCredentials: true }
      );

      const { accessToken, user: userData } = response.data;

      // Store access token
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear local state
      localStorage.removeItem('accessToken');
      setUser(null);
      disconnect();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      setUser(null);
      throw error;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await api.get('/admin/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh token when connected
  useEffect(() => {
    if (connected && user) {
      const interval = setInterval(() => {
        refreshToken().catch(console.error);
      }, 14 * 60 * 1000); // Refresh every 14 minutes (before 15-minute expiry)

      return () => clearInterval(interval);
    }
  }, [connected, user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { api }; 