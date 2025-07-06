"use client";
import { FaFilter, FaChevronDown } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
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

// const COLORS = data.map(d => d.color);


export function TotalQuestionPieChart() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState("This week");
  const chartData = filter === "This week" ? dataWeek : dataMonth;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);


  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-semibold">Total Questions</div>
          <div className="text-2xl font-bold mt-1">7.852.000</div>
        </div>
        <div className="relative inline-block">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
          >
            <span>{filter}</span>
            <FaChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => { setFilter("This week"); setIsFilterOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 "
              >
                This Week
              </button>
              <button
                onClick={() => { setFilter("This month"); setIsFilterOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 "
              >
                This Month
              </button>
            </div>
          )}
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
          {chartData.map((entry, idx) => (
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
