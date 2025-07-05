"use client";
import { BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'GPT', value: 18000 },
  { name: 'Grok', value: 30000 },
  { name: 'Gemini', value: 22000 },
  { name: 'Claude', value: 31000 },
];

export function TopSelectedModelBarChart() {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="text-sm font-semibold mb-2">Top Selected Model</h4>
      <BarChart width={350} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" fill="#60a5fa" />
      </BarChart>
    </div>
  );
}
