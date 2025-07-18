export interface FaucetRequest {
  walletAddress: string;
}

export interface FaucetResponse {
  message?: string;
  error?: string;
  status?:string
}