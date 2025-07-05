"use client";
import { FaFilter, FaChevronDown } from 'react-icons/fa';
// components/PieChartCard.tsx
import { PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
const data = [
  { name: 'Good', value: 4030890, color: '#222' },
  { name: 'Bad', value: 2398039, color: '#7ECFFF' },
  { name: 'Not rating', value: 1387980, color: '#8CF2C6' },
];

// const COLORS = data.map(d => d.color);


export function TotalQuestionPieChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-semibold">Total Questions</div>
          <div className="text-2xl font-bold mt-1">7.852.000</div>
        </div>
        <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
        >
            <span>This Week</span>

            <FaChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex items-center justify-between mt-2">
        {/* Pie Chart */}
        <div>
            <PieChart width={300} height={200}>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                >
                {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
                </Pie>
            
            </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {data.map((entry, idx) => (
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
