import { Charts } from "./Charts";
import { TotalQuestionPieChart } from "./TotalQuestionPieChart";
import { TopSelectedModelBarChart } from "./TopSelectedModelBarchart";

export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            <div className="text-2xl font-bold text-[#292D32] mb-6">
                Overview
            </div>
            
            {/* Row 1: Session & Avg Questions/User */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <div className="text-sm font-semibold text-gray-700">Session</div>
                    <div className="text-3xl font-bold mt-2">256</div>
                    <div className="text-green-600 font-semibold mt-2">+15.03%</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <div className="text-sm font-semibold text-gray-700">Average Questions/User</div>
                    <div className="text-3xl font-bold mt-2">3,7</div>
                    <div className="text-green-600 font-semibold mt-2">+6.08%</div>
                </div>
            </div>

            {/* Row 2: Total Questions & Top Selected Model */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <TotalQuestionPieChart />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="text-sm font-semibold mb-2">Top Selected Model</div>
                    <TopSelectedModelBarChart />
                </div>
            </div>

            {/* Row 3: Questions by Handling Mode */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="text-sm font-semibold mb-2">Questions by Handling Mode</div>
            </div>
        </div>
    );
}