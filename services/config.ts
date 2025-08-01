import apiClient from '@/utils/api'; 
import axios from 'axios';

export interface FaucetConfigUpdate {
  faucetAmount?: number;
  cooldownSeconds?: number;
  dailyLimit?: number;
  enabled?: boolean;
  maxRequestsPerIp?: number;
  maxRequestsPerWallet?:number,
}

export async function updateFaucetConfig(configData: FaucetConfigUpdate): Promise<{
  success: boolean;
  config: any;
}> {
  try {
    const response = await apiClient.post('/admin/config/update', configData);
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating faucet config:', error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error(`Validation failed: ${JSON.stringify(error.response.data.issues)}`);
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else if (error.response?.status === 500) {
      throw new Error('Failed to update faucet config. Please try again.');
    }
    
    throw new Error(error.response?.data?.error || 'Failed to update config');
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getFaucetConfig(): Promise<{
  success: boolean;
  config: {
  availableBalance:number,
  cooldownSeconds: number;
  faucetAmount: number;
  enabled: boolean;
  maxRequestsPerIp: number;
  maxRequestsPerWallet: number;
};
}> {
  try {
    const response = await api.get('/admin/config');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching faucet config:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else if (error.response?.status === 500) {
      throw new Error('Failed to fetch faucet configuration.');
    }
    
    throw new Error(error.response?.data?.error || 'Failed to fetch config');
  }
}
