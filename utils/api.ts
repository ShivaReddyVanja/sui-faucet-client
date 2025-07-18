import axios from 'axios';
import { FaucetRequest, FaucetResponse } from '@/lib/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const requestFaucet = async (walletAddress: string): Promise<FaucetResponse> => {
  try {
    const response = await api.post<FaucetResponse>('/api/faucet', { walletAddress } as FaucetRequest);
    return response.data;
  } catch (error:any) {
    return { error: error.response?.data?.error || 'Failed to request tokens' };
  }
};