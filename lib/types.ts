export interface FaucetRequest {
  walletAddress: string;
}

export interface FaucetResponse {
  tx?:string,
  nextClaimTimestamp?:number,
  message?: string;
  error?: string;
  status?:string
}