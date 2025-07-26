"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Scale,
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAnalytics, TimeseriesResponse } from "@/utils/fetchAnalytics";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend);

interface ActivityChartProps {
  timeseries: TimeseriesResponse;
}

export function ActivityChart({ timeseries: initialData }: ActivityChartProps) {
  const [granularity, setGranularity] = useState(initialData.granularity);
  const [range, setRange] = useState(initialData.range);
  const [data, setData] = useState(initialData.data);

  useEffect(() => {
    const load = async () => {
      try {
        const { timeseries } = await fetchAnalytics(granularity, range);
        setData(timeseries.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    load();
  }, [granularity, range]);

  const chartData = {
    labels: data.map((d) => d.time),
  datasets: [
  {
    label: "Total",
    data: data.map((d) => d.total),
    borderColor: "#1a75ff", // Bright Blue
    backgroundColor: "#1a75ff20", // Transparent fill
    pointBackgroundColor: "#1a75ff",
    tension: 0.4,
  },
  {
    label: "Success",
    data: data.map((d) => d.success),
    borderColor: "#00cc99", // Aqua Green
    backgroundColor: "#00cc9920",
    pointBackgroundColor: "#00cc99",
    tension: 0.4,
  },
  {
    label: "Failed",
    data: data.map((d) => d.failed),
    borderColor: "#ff4d4f", // Coral Red
    backgroundColor: "#ff4d4f20",
    pointBackgroundColor: "#ff4d4f",
    tension: 0.4,
  },
  {
    label: "Tokens (SUI)",
    data: data.map((d) => d.tokens / 1_000_000_000),
    borderColor: "#d4af37", // Gold
    backgroundColor: "#d4af3720",
    pointBackgroundColor: "#d4af37",
    tension: 0.4,
    yAxisID: "tokens",
  },
]

  };

const timeUnit: "hour" | "day" = granularity === "hourly" ? "hour" : "day";

const chartOptions = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      type: "time" as const,
      time: {
        unit: timeUnit,
        tooltipFormat: "MMM d, h a",
      },
      title: { display: false },
      ticks: { color: "#a0aec0" },
    },
    y: {
      beginAtZero: true,
      title: { display: true, text: "Requests" },
      ticks: { color: "#a0aec0" },
    },
    tokens: {
      beginAtZero: true,
      position: "right" as const,
      title: { display: true, text: "Tokens (SUI)" },
      ticks: {
        color: "#a0aec0",

        callback: function (this: Scale, value: string | number): string {
          return `${value} SUI`;
        }
      },
      grid: { drawOnChartArea: false },
    },
  },
};

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2">
        <Select value={granularity} onValueChange={setGranularity}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full min-h-[300px]">
      
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
