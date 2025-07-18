"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { getWeekOfMonth, isThisWeek, isThisMonth } from "@/lib/utils";

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

function groupRatingsByWeek(messages: any[], feedbacks: any[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const feedbackMap: { [messageId: string]: string } = {};
  feedbacks.forEach(fb => {
    if (fb.messageId?.S && fb.type?.S) {
      feedbackMap[fb.messageId.S] = fb.type.S;
    }
  });

  const weekMap: { [week: number]: { Good: number; Bad: number; "Not rating": number } } = {};

  messages.forEach(msg => {
    const ts = msg.timestamp?.S;
    const id = msg.id?.S;
    const date = new Date(ts);
    if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) return;

    const week = getWeekOfMonth(ts);
    if (!weekMap[week]) {
      weekMap[week] = { Good: 0, Bad: 0, "Not rating": 0 };
    }
    const rating = id && feedbackMap[id] ? feedbackMap[id] : "Not rating";
    if (rating === "good") weekMap[week].Good += 1;
    else if (rating === "bad") weekMap[week].Bad += 1;
    else weekMap[week]["Not rating"] += 1;
  });

  return Object.keys(weekMap)
    .sort((a, b) => Number(a) - Number(b))
    .map(week => ({
      name: `Week ${week}`,
      ...weekMap[Number(week)],
    }));
}

export function WeeklyAnswerChart({
  messages,
  feedbacks,
}: {
  messages: any;
  feedbacks: any;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState("This Month");
  const [chartData, setChartData] = useState<{ name: string; Good: number; Bad: number; "Not rating": number }[]>([]);
  const [totalGood, setTotalGood] = useState(0);
  const [totalBad, setTotalBad] = useState(0);

  useEffect(() => {
    if (messages.Items && feedbacks.Items) {
      let filteredMessages = messages.Items.filter((item: any) => item.role?.S === "assistant");
      filteredMessages = filteredMessages.filter((item: any) =>
        isThisMonth(item.timestamp?.S)
      );
      let filteredFeedbacks = feedbacks.Items.filter((item: any) =>
        isThisMonth(item.timestamp?.S)
      );
      setTotalGood(filteredFeedbacks.filter((item: any) => item.type?.S === "good").length);
      setTotalBad(filteredFeedbacks.filter((item: any) => item.type?.S === "bad").length);
      if (filter === "This Month") {
        setChartData(groupRatingsByWeek(filteredMessages, filteredFeedbacks));
      } else if (filter === "This Week") {
        filteredMessages = filteredMessages.filter((item: any) =>
          isThisWeek(item.timestamp?.S)
        );
        filteredFeedbacks = filteredFeedbacks.filter((item: any) =>
          isThisWeek(item.timestamp?.S)
        );
        setChartData(groupRatingsByWeek(filteredMessages, filteredFeedbacks));
      }
    }
  }, [messages, feedbacks, filter]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-semibold text-[#222]">Weekly Answer Quality Trend</div>
          <div className="text-base text-[#6B7280] mt-1">
            {totalGood} Good & {totalBad} Bad in this Month
          </div>
        </div>
        <div className="relative inline-block">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200"
          >
            <span>{filter}</span>
            <FaChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => { setFilter("This Month"); setIsFilterOpen(false); }}
              >
                This Month
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => { setFilter("This Week"); setIsFilterOpen(false); }}
              >
                This Week
              </button>
            </div>
          )}
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




