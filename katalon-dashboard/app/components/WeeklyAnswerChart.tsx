"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardFilterState } from './DashboardFilter';

const dataMonth = [
  { name: "Week 1", Good: 7560, Bad: 15420, "Not rating": 9000 },
  { name: "Week 2", Good: 12000, Bad: 6000, "Not rating": 5000 },
  { name: "Week 3", Good: 5000, Bad: 10000, "Not rating": 8000 },
  { name: "Week 4", Good: 15000, Bad: 7000, "Not rating": 11000 },
];
const dataWeek = [
  { name: "Week 4", Good: 15000, Bad: 7000, "Not rating": 11000 },
];

const COLORS = {
  Good: "#174AFF",
  Bad: "#FFB800",
  "Not rating": "#D17BBE",
};

interface WeeklyAnswerChartProps {
  filters?: DashboardFilterState;
}

export function WeeklyAnswerChart({ filters }: WeeklyAnswerChartProps) {
  // Use the global filter to determine which data to show
  const chartData = filters?.timeRange === "month" ? dataMonth : dataWeek;
  
  // Calculate totals for the subtitle
  const totalGood = chartData.reduce((sum, item) => sum + item.Good, 0);
  const totalBad = chartData.reduce((sum, item) => sum + item.Bad, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-semibold text-[#222]">Weekly Answer Quality Trend</div>
          <div className="text-base text-[#6B7280] mt-1">
            {totalGood.toLocaleString("en-US")} Good & {totalBad.toLocaleString("en-US")} Bad in this {filters?.timeRange === "month" ? "Month" : "Week"}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-6 mb-2 mt-2 justify-end">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS.Good }} />
          <span className="text-sm text-[#174AFF]">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS.Bad }} />
          <span className="text-sm text-[#FFB800]">Bad</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS["Not rating"] }} />
          <span className="text-sm text-[#D17BBE]">Not rating</span>
        </div>
      </div>
      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={30}>
            <YAxis
              axisLine={false}
              tickLine={false}
              fontSize={13}
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
            <Bar dataKey="Good" fill={COLORS.Good} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Bad" fill={COLORS.Bad} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Not rating" fill={COLORS["Not rating"]} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
