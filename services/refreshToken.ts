import axios from "axios";

// In your utils/api.ts
export async function refreshAccessToken(): Promise<{
  success: boolean;
  accessToken: string;
  user: {
    walletAddress: string;
    role: string;
  };
}> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    
    const response = await axios.post(`${baseURL}/admin/refresh`, {}, {
      withCredentials: true, // Essential: Send refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Token refresh failed:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Refresh token expired or invalid');
    }
    
    throw new Error(error.response?.data?.error || 'Token refresh failed');
  }
}
