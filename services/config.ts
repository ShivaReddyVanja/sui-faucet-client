import apiClient from '@/utils/api'; 

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

export async function getFaucetConfig(): Promise<{
  success: boolean;
  config: {
    tokenAmount: number;
    cooldownPeriod: number;
    maxRequestsPerWallet: number;
    isActive: boolean;
    maxRequestsPerIP: number;
  };
}> {
  try {
    const response = await apiClient.get('/admin/config');
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
