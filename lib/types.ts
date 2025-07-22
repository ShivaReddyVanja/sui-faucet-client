export interface FaucetRequest {
  walletAddress: string;
}

export interface FaucetResponse {
  nextClaimTimestamp?:number,
  message?: string;
  error?: string;
  status?:string
}