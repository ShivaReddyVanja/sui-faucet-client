"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle, XCircle, Wallet } from "lucide-react";
import { ActivityChart } from "./components/activity-chart";
import { TopLists } from "./components/top-lists";
import { RecentRequestsTable } from "./components/recent-requests";
import { useEffect, useState } from "react";
import { fetchAnalytics, SummaryStats, TimeseriesResponse } from "@/services/fetchAnalytics";


export default function DashboardOverviewPage() {
  const [data, setData] = useState<{
    summary: SummaryStats;
    timeseries: TimeseriesResponse;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await fetchAnalytics("hourly", "24h");
        setData(analytics);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="text-center py-10 text-red-500">Failed to load dashboard data.</div>;
  }

  const { totalRequests, successRequests, failedRequests, totalTokensSent, recentRequests, topWallets, topIps } =
    data.summary;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="bg-[#011829]/86 text-white rounded-2xl shadow-xl p-6 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wallet className="h-4 w-4 text-sui-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-sui-aqua">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#011829]/86 text-white rounded-2xl shadow-xl p-6 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-sui-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRequests.toLocaleString()}</div>
            <p className="text-xs text-sui-aqua">+18.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#011829]/86 text-white rounded-2xl shadow-xl p-6 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Requests</CardTitle>
            <XCircle className="h-4 w-4 text-sui-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedRequests.toLocaleString()}</div>
            <p className="text-xs text-sui-aqua">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#011829]/86 text-white rounded-2xl shadow-xl p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Sent (SUI)</CardTitle>
            <DollarSign className="h-4 w-4 text-sui-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokensSent/1000000000}</div>
            <p className="text-xs text-sui-aqua">+10.0% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 font-semibold rounded-2xl shadow-xl p-6 ">
          <CardHeader>
            <CardTitle>Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart timeseries={data.timeseries} />
          </CardContent>
        </Card>
        <Card className="bg-[#011829]/86 text-white  rounded-2xl shadow-xl overflow-clip">
          <CardHeader>
            <CardTitle>Top Wallets & IPs</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <TopLists topWallets={topWallets} topIps={topIps} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#011829]/86 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white">
        <CardHeader className="py-0">
          <CardTitle className="text-2xl">Recent Requests</CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-2xl text-black p-0">
          <RecentRequestsTable requests={recentRequests} />
        </CardContent>
      </Card>
    </main>
  );
}