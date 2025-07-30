"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Wallet, Coins, Send } from "lucide-react"
import { ActivityChart } from "./components/activity-chart"
import { TopLists } from "./components/top-lists"
import { RecentRequestsTable } from "./components/recent-requests"
import { useEffect, useState } from "react"
import { fetchAnalytics, type SummaryStats, type TimeseriesResponse } from "@/services/fetchAnalytics"
import { getFaucetConfig } from "@/services/config"
import type { Config } from "@/lib/types"

export default function DashboardOverviewPage() {
  const [data, setData] = useState<{
    summary: SummaryStats
    timeseries: TimeseriesResponse
  } | null>(null)
  const [config, setConfig] = useState<Config>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await fetchAnalytics("hourly", "24h")
        const config = (await getFaucetConfig()).config
        setConfig(config)
        setData(analytics)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center py-10 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          Loading analytics...
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center py-10 text-red-500">Failed to load dashboard data.</div>
      </div>
    )
  }

  const { totalRequests, successRequests, failedRequests, totalTokensSent, recentRequests, topWallets, topIps } =
    data.summary

  return (
    <main className="flex flex-1 flex-col gap-4 p-2 sm:p-4 md:gap-6 md:p-6">
      {/* Stats Cards Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Available Balance Card */}
        <Card className="bg-[#011829]/86 text-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Available Balance (SUI)</CardTitle>
            <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-sui-aqua flex-shrink-0" />
          </CardHeader>
          <CardContent className="space-y-1 p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{config?.availableBalance.toFixed(2)}</div>
            <p className="text-xs text-sui-aqua">+10.0% from last month</p>
          </CardContent>
        </Card>

        {/* Tokens Sent Card */}
        <Card className="bg-[#011829]/86 text-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Tokens Sent (SUI)</CardTitle>
            <Send className="h-3 w-3 sm:h-4 sm:w-4 text-sui-aqua flex-shrink-0" />
          </CardHeader>
          <CardContent className="space-y-1 p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">
              {(totalTokensSent / 1_000_000_000).toFixed(2)}
            </div>
            <p className="text-xs text-sui-aqua">+10.0% from last month</p>
          </CardContent>
        </Card>

        {/* Total Requests Card */}
        <Card className="bg-[#011829]/86 text-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Total Requests</CardTitle>
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-sui-aqua flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-sui-aqua">+20.1% from last month</p>
          </CardContent>
        </Card>

        {/* Successful Requests Card */}
        <Card className="bg-[#011829]/86 text-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Successful Requests</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-sui-aqua flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{successRequests.toLocaleString()}</div>
            <p className="text-xs text-sui-aqua">+18.5% from last month</p>
          </CardContent>
        </Card>

        {/* Failed Requests Card */}
        <Card className="bg-[#011829]/86 text-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Failed Requests</CardTitle>
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-sui-aqua flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{failedRequests.toLocaleString()}</div>
            <p className="text-xs text-sui-aqua">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists Grid */}
      <div className="w-full">
        {/* Activity Chart - Takes full width on mobile, 2 columns on xl */}
        <Card className="xl:col-span-2 font-semibold rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 gap-0 min-h-[360px] sm:min-h-[420px]">
          <CardHeader className="p-0 pb-0 sm:pb-0 mb-0">
            <CardTitle className="text-lg sm:text-xl">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[250px] sm:h-[300px] lg:h-[400px] w-full">
              <ActivityChart timeseries={data.timeseries} />
            </div>
          </CardContent>
        </Card>
  </div>
        {/* Top Lists */}
        <Card className="bg-white text-black rounded-xl sm:rounded-2xl shadow-xl overflow-hidden gap-0">
          <CardHeader className="p-0 sm:p-2 lg:p-3 pb-2 px-6">
            <CardTitle className="text-lg sm:text-xl">Top Wallets & IPs</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3">
            <TopLists topWallets={topWallets} topIps={topIps} />
          </CardContent>
        </Card>
    

      {/* Recent Requests Table */}
      <Card className="text-black backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 bg-white">
        <CardHeader className="py-0 pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Recent Requests</CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-xl sm:rounded-2xl text-black p-0">
          <div className="overflow-x-auto">
            <RecentRequestsTable requests={recentRequests} />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
