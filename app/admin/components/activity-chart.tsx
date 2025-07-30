"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js"
import "chartjs-adapter-date-fns"
import { Line } from "react-chartjs-2"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchAnalytics, type TimeseriesResponse } from "@/services/fetchAnalytics"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend)

interface ActivityChartProps {
  timeseries: TimeseriesResponse
}

export function ActivityChart({ timeseries: initialData }: ActivityChartProps) {
  const [granularity, setGranularity] = useState("daily")
  const [range, setRange] = useState("7d")
  const [data, setData] = useState(initialData.data)

  useEffect(() => {
    const load = async () => {
      try {
        const { timeseries } = await fetchAnalytics(granularity, range)
        setData(timeseries.data)
      } catch (err) {
        console.error("Failed to fetch analytics", err)
      }
    }
    load()
  }, [granularity, range])

  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: "Total Requests",
        data: data.map((d) => d.total),
        borderColor: "#1a75ff",
        backgroundColor: "#1a75ff20",
        pointBackgroundColor: "#1a75ff",
        pointBorderColor: "#1a75ff",
        pointRadius: 1,
        pointHoverRadius: 3,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Successful ",
        data: data.map((d) => d.success),
        borderColor: "#00cc99",
        backgroundColor: "#00cc9920",
        pointBackgroundColor: "#00cc99",
        pointBorderColor: "#00cc99",
        pointRadius: 1,
        pointHoverRadius: 3,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Failed",
        data: data.map((d) => d.failed),
        borderColor: "#ff4d4f",
        backgroundColor: "#ff4d4f20",
        pointBackgroundColor: "#ff4d4f",
        pointBorderColor: "#ff4d4f",
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  }

  const timeUnit: "hour" | "day" = granularity === "hourly" ? "hour" : "day"

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: window.innerWidth < 640 ? 12 : 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: window.innerWidth < 640 ? 12 : 14,
        },
        bodyFont: {
          size: window.innerWidth < 640 ? 11 : 13,
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: timeUnit,
          tooltipFormat: granularity === "hourly" ? "MMM d, h a" : "MMM d",
          displayFormats: {
            hour: window.innerWidth < 640 ? "ha" : "MMM d, ha",
            day: window.innerWidth < 640 ? "M/d" : "MMM d",
          },
        },
        title: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          maxTicksLimit: window.innerWidth < 640 ? 4 : 8,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: window.innerWidth >= 640,
          text: "Requests",
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
        ticks: {
          color: "#6b7280",
          maxTicksLimit: window.innerWidth < 640 ? 5 : 8,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          callback: (value: string | number): string => {
            if (typeof value === "number") {
              return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
            }
            return value
          },
        },
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
      },
    },
    elements: {
      point: {
        radius: window.innerWidth < 640 ? 2 : 3,
        hoverRadius: window.innerWidth < 640 ? 4 : 5,
      },
      line: {
        borderWidth: window.innerWidth < 640 ? 1 : 2,
      },
    },
  }

  return (
    <div className="flex flex-col gap-1 sm:gap-4 h-full">
      {/* Controls */}
      <div className="flex flex-row justify-center sm:justify-end gap-2">
        <Select value={granularity} onValueChange={setGranularity}>
          <SelectTrigger className="w-1/2 sm:w-[120px] h-4 sm:h-10 text-xs sm:text-sm">
            <SelectValue placeholder="Granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-1/2 sm:w-[120px] h-8 sm:h-10 text-xs sm:text-sm">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full relative min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
