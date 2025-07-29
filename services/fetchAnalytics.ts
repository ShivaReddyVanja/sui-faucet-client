import {SummaryStats } from "@/lib/types";
import apiClient from "../utils/api";

// Define types for timeseries data
export interface TimeseriesDataPoint {
  time: string;
  total: number;
  success: number;
  failed: number;
  tokens: number;
}

export interface TimeseriesResponse {
  granularity: string;
  range: string;
  data: TimeseriesDataPoint[];
}

export async function fetchAnalytics(granularity = "hourly", range = "24h"): Promise<{
  summary: SummaryStats;
  timeseries: TimeseriesResponse;
}> {
  try {
    // Much cleaner with the API client
    const [summaryResponse, timeseriesResponse] = await Promise.all([
      apiClient.get('/admin/analytics'),
      apiClient.get(`/admin/analytics/timeseries?granularity=${granularity}&range=${range}`)
    ]);

    const summaryData = summaryResponse.data;
    const timeseriesData = timeseriesResponse.data;

    return {
      summary: {
        totalRequests: summaryData.totals.requests,
        successRequests: summaryData.totals.success,
        failedRequests: summaryData.totals.failed,
        totalTokensSent: summaryData.totals.tokensDispensed,
        recentRequests: summaryData.recent,
        topWallets: summaryData.topWallets,
        topIps: summaryData.topIps,
      },
      timeseries: timeseriesData,
    };
  } catch (err) {
    console.error("Error fetching analytics:", err);
    throw err;
  }
}

export type { SummaryStats };
