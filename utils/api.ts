// Enhanced utils/api.ts
import { refreshAccessToken } from '@/services/refreshToken';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't already tried to refresh
    if ((error.response?.status === 401 || error.response?.status===403)  && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If already refreshing, wait for the existing refresh
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start refresh process
      isRefreshing = true;
      refreshPromise = handleTokenRefresh();

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

// Handle token refresh
async function handleTokenRefresh(): Promise<string> {
  try {
    const refreshResponse = await refreshAccessToken();
    const { accessToken, user } = refreshResponse;
    
    // Update stored token and user info
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('walletAddress', user.walletAddress);
    
    console.log('Token refreshed successfully');
    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

// Handle authentication failure
function handleAuthFailure() {
  // Clear stored tokens
  localStorage.removeItem('adminToken');
  localStorage.removeItem('walletAddress');
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
}

export default apiClient;
