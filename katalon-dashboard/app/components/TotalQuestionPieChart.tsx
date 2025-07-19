"use client";
import { FaChevronDown } from 'react-icons/fa';
import { PieChart, Pie, Cell } from 'recharts';
import { DashboardFilterState } from './DashboardFilter';

const dataMonth = [
  { name: 'Good', value: 4030890, color: '#222' },
  { name: 'Bad', value: 2398039, color: '#7ECFFF' },
  { name: 'Not rating', value: 1387980, color: '#8CF2C6' },
];
const dataWeek = [
  { name: 'Good', value: 4030890, color: '#222' },
  { name: 'Bad', value: 2000000, color: '#7ECFFF' },
  { name: 'Not rating', value: 1000000, color: '#8CF2C6' },
];

interface TotalQuestionPieChartProps {
  filters?: DashboardFilterState;
}

export function TotalQuestionPieChart({ filters }: TotalQuestionPieChartProps) {
  // Use the global filter to determine which data to show
  const chartData = filters?.timeRange === "month" ? dataMonth : dataWeek;
  
  // Calculate total based on current data
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-semibold">Total Questions</div>
          <div className="text-2xl font-bold mt-1">{total.toLocaleString("en-US")}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between mt-2 gap-6">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 flex justify-center">
          <PieChart width={220} height={180}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
              </Pie>
            </PieChart>
          
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex justify-between items-center min-w-[140px]">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-700">{entry.name}</span>
              </div>
              <div className="ml-2 text-sm font-semibold text-gray-900 tabular-nums text-right min-w-[70px]">
                {entry.value.toLocaleString("en-US")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
