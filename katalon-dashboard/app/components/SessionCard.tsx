import { FiTrendingUp } from "react-icons/fi";

interface SessionCardProps {
    title: string;
    value: number;
    percent: number;
}

export function SessionCard({ title, value, percent }: SessionCardProps) {
    return (
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col gap-2">
          <h4 className="text-black text-lg font-semibold">{title}</h4>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div className="inline-flex items-center justify-center w-12 h-10 border border-black rounded-full">
            <FiTrendingUp className="w-8 h-8 font-semibold" />
          </div>
          <p className="text-2xl  text-black">+{percent}%</p>
        </div>
      </div>
    )
  }