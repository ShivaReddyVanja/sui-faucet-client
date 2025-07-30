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

export type FaucetStatus = "success" | "failed"

export interface SummaryStats {
  totalRequests: number
  successRequests: number
  failedRequests: number
  totalTokensSent: number
}

export interface TopEntry {
  wallet: string
  count: number
}

export interface TopIp {
  ip: string
  count: number
}



export interface AnalyticsResponse {
  summary: SummaryStats
  topWallets: TopEntry[]
  topIps: TopIp[]
  recentRequests: RecentRequest[]
}

export interface TimeSeriesPoint {
  time: string // ISO date or hour
  total: number
  success: number
  failed: number
  tokens: number
}

export interface TimeSeriesResponse {
  granularity: "hourly" | "daily"
  range: "24h" | "7d" | "30d"
  data: TimeSeriesPoint[]
}

export interface RecentRequest {
  id: number;
  walletAddress: string;
  ipAddress: string;
  status: "success" | "failed";
  amount: number;
  txHash: string | null;
  createdAt: string;
}

export interface TopWallet {
  walletAddress: string;
  _count: number;
}

export interface TopIp {
  ipAddress: string;
  _count: number;
}

export interface SummaryStats {
  totalRequests: number;
  successRequests: number;
  failedRequests: number;
  totalTokensSent: number;
  recentRequests: RecentRequest[];
  topWallets: TopWallet[];
  topIps: TopIp[];
}
export interface Config {
  availableBalance:number,
  cooldownSeconds: number;
  faucetAmount: number;
  enabled: boolean;
  maxRequestsPerIp: number;
  maxRequestsPerWallet: number;
}