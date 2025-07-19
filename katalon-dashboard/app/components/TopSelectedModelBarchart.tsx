"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Cell } from "recharts";
import { DashboardFilterState } from './DashboardFilter';

const dataWeek = [
  { name: "GPT", value: 18000, color: "#A5A6F6" },
  { name: "Grok", value: 30000, color: "#8CF2C6" },
  { name: "Gemini", value: 21000, color: "#222" },
  { name: "Claude", value: 32000, color: "#7ECFFF" },
];

const dataMonth = [
  { name: "GPT", value: 25000, color: "#A5A6F6" },
  { name: "Grok", value: 35000, color: "#8CF2C6" },
  { name: "Gemini", value: 27000, color: "#222" },
  { name: "Claude", value: 28000, color: "#7ECFFF" },
];

interface TopSelectedModelBarChartProps {
  filters?: DashboardFilterState;
}

export function TopSelectedModelBarChart({ filters }: TopSelectedModelBarChartProps) {
  // Use the global filter to determine which data to show
  const chartData = filters?.timeRange === "month" ? dataMonth : dataWeek;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-semibold">Top Selected Model</div>
      </div>
      {/* Chart */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={30}>
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v / 1000}K`}
              fontSize={12}
              stroke="#B0B0B0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              fontSize={13}
              stroke="#B0B0B0"
            />
            <Tooltip
              cursor={{ fill: "#f3f4f6" }}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
              formatter={v => v.toLocaleString("en-US")}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
