"use client";

import { useCallback } from "react";
import { TotalQuestionPieChart } from "./TotalQuestionPieChart";
import { TopSelectedModelBarChart } from "./TopSelectedModelBarchart";
import { SessionCard } from "./SessionCard";
import { WeeklyAnswerChart } from "./WeeklyAnswerChart";
import { DashboardFilter } from "./DashboardFilter";
import { DashboardFilterProvider, useDashboardFilter } from "./DashboardFilterContext";

function DashboardContent() {
    const { filters, setFilters } = useDashboardFilter();

    const handleFilterChange = useCallback((newFilters: any) => {
        setFilters(newFilters);
        // Here you can add logic to refetch data or update child components
        console.log("Dashboard filters changed:", newFilters);
    }, [setFilters]);

    return (
        <div className="p-6 space-y-6">
            {/* Header with Overview title and Filter */}
            <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-[#292D32]">
                    Overview
                </div>
                <DashboardFilter onFilterChange={handleFilterChange} />
            </div>
            
            {/* Row 1: Session & Avg Questions/User */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <SessionCard title="Session" value={100} percent={10} />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <SessionCard title="Average Questions/User" value={3.7} percent={6.08} />
                </div>
            </div>

            {/* Row 2: Total Questions & Top Selected Model */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <TotalQuestionPieChart filters={filters} />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <TopSelectedModelBarChart filters={filters} />
                </div>
            </div>

            {/* Row 3: Questions by Handling Mode */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <WeeklyAnswerChart filters={filters} />
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <DashboardFilterProvider>
            <DashboardContent />
        </DashboardFilterProvider>
    );
}