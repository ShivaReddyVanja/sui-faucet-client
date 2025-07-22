import axios from 'axios';
import { FaucetRequest, FaucetResponse } from '@/lib/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const requestFaucet = async (walletAddress: string): Promise<FaucetResponse> => {
  try {
    const response: any = await api.post<FaucetResponse>('/api/faucet', { walletAddress } as FaucetRequest);
    console.log(response);
    return {
      status: "success",
      message: response.data.message,
      nextClaimTimestamp:86400
    };
  } catch (error: any) {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter;
      const nextClaimTimestamp = retryAfter ? Date.now() + (parseInt(retryAfter) * 1000) : 86400;
      return {
        status: "error",
        error: error.response?.data?.error || 'Failed to request..',
        nextClaimTimestamp,
      };
    }
    return {
      status: "error",
      error: error.response?.data?.error || 'Failed to request..',
    };
  }
};