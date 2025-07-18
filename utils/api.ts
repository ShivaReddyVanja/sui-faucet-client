import axios from 'axios';
import { FaucetRequest, FaucetResponse } from '@/lib/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const requestFaucet = async (walletAddress: string): Promise<FaucetResponse> => {
  try {
    const response:any = await api.post<FaucetResponse>('/api/faucet', { walletAddress } as FaucetRequest);
    console.log(response);
    return {
      status:"success",
      message:response.data.message
    };
  } catch (error:any) {
    return { 
      error: error.response?.data?.error || 'Too many requests',
     status:"error"
    };
  }
};