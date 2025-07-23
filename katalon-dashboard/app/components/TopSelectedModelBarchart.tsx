"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Cell } from "recharts";
import { isThisWeek, isThisMonth } from "@/lib/utils";

export function TopSelectedModelBarChart({ messages }: { messages: any }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState("This week");
  const [chartData, setChartData] = useState([
    { name: "GPT", value: 0, color: "#A5A6F6" },
    { name: "Grok", value: 0, color: "#8CF2C6" },
    { name: "Gemini", value: 0, color: "#222" },
    { name: "Claude", value: 0, color: "#7ECFFF" },
  ]);

  useEffect(() => {
    if (messages.Items) {
      let filtered = messages.Items.filter(
        (item: any) => item.role?.S === "assistant"
      );
      if (filter === "This week") {
        filtered = filtered.filter((item: any) =>
          isThisWeek(item.timestamp?.S)
        );
      } else if (filter === "This month") {
        filtered = filtered.filter((item: any) =>
          isThisMonth(item.timestamp?.S)
        );
      }
      setChartData([
        {
          name: "GPT",
          value: filtered.filter((item: any) => item.model?.S.includes("GPT"))
            .length,
          color: "#A5A6F6",
        },
        {
          name: "Grok",
          value: filtered.filter((item: any) => item.model?.S.includes("GROK"))
            .length,
          color: "#8CF2C6",
        },
        {
          name: "Gemini",
          value: filtered.filter((item: any) =>
            item.model?.S.includes("GEMINI")
          ).length,
          color: "#222",
        },
        {
          name: "Claude",
          value: filtered.filter((item: any) =>
            item.model?.S.includes("CLAUDE")
          ).length,
          color: "#7ECFFF",
        },
      ]);
    }
  }, [messages, filter]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-semibold">Top Selected Model</div>
        <div className="relative inline-block">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
          >
            <span>{filter}</span>
            <FaChevronDown
              className={`h-3 w-3 transition-transform ${isFilterOpen ? "rotate-180" : ""
                }`}
            />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setFilter("This week");
                  setIsFilterOpen(false);
                }}
              >
                This week
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setFilter("This month");
                  setIsFilterOpen(false);
                }}
              >
                This month
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Chart */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={30}>
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v / 1000}K`}
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
              formatter={(v) => v.toLocaleString("en-US")}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={true}>
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
