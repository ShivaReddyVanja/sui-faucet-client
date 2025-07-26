import { RecentRequest, SummaryStats } from "@/lib/types";

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

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAnalytics(granularity = "hourly", range = "24h"): Promise<{
  summary: SummaryStats;
  timeseries: TimeseriesResponse;
}> {
  try {
    // Fetch summary analytics
    const summaryResponse = await fetch(`${apiUrl}/api/admin/analytics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!summaryResponse.ok) {
      throw new Error("Failed to fetch summary analytics");
    }

    const summaryData = await summaryResponse.json();

    // Fetch timeseries analytics
    const timeseriesResponse = await fetch(
      `${apiUrl}/api/admin/analytics/timeseries?granularity=${granularity}&range=${range}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!timeseriesResponse.ok) {
      throw new Error("Failed to fetch timeseries analytics");
    }

    const timeseriesData = await timeseriesResponse.json();

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
