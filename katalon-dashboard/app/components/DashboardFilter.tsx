"use client";

import { useState, useEffect, useRef } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";

export interface DashboardFilterState {
    startDate: string;
    endDate: string;
    timeRange: "hour" | "today" | "week" | "month" | "year";
}

interface DashboardFilterProps {
    onFilterChange: (filters: DashboardFilterState) => void;
}

export function DashboardFilter({ onFilterChange }: DashboardFilterProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const onFilterChangeRef = useRef(onFilterChange);

    // Update ref when onFilterChange changes
    useEffect(() => {
        onFilterChangeRef.current = onFilterChange;
    }, [onFilterChange]);

    // Filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeRange, setTimeRange] = useState<"hour" | "today" | "week" | "month" | "year">("week");

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen]);

    // Update filters when any filter changes
    useEffect(() => {
        onFilterChangeRef.current({
            startDate,
            endDate,
            timeRange
        });
    }, [startDate, endDate, timeRange]);

    // Handle time range changes
    const handleTimeRangeChange = (range: "hour" | "today" | "week" | "month" | "year") => {
        setTimeRange(range);
        
        // Auto-set date range based on selection
        const now = new Date();
        let start = "";
        let end = "";

        switch (range) {
            case "hour":
                const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
                start = twelveHoursAgo.toISOString().split('T')[0];
                end = now.toISOString().split('T')[0];
                break;
            case "today":
                start = now.toISOString().split('T')[0];
                end = now.toISOString().split('T')[0];
                break;
            case "week":
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                start = weekAgo.toISOString().split('T')[0];
                end = now.toISOString().split('T')[0];
                break;
            case "month":
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                start = monthAgo.toISOString().split('T')[0];
                end = now.toISOString().split('T')[0];
                break;
            case "year":
                const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                start = yearAgo.toISOString().split('T')[0];
                end = now.toISOString().split('T')[0];
                break;
        }

        setStartDate(start);
        setEndDate(end);
        
        // Auto-close dropdown after selection
        setIsFilterOpen(false);
    };

    const getActiveFiltersCount = () => {
        // Check if a non-default filter is selected
        if (timeRange && timeRange !== "week") {
            return 1;
        }
        return 0;
    };

    const clearAllFilters = () => {
        setTimeRange("week");
        setStartDate("");
        setEndDate("");
        
        // Auto-close dropdown after clearing
        setIsFilterOpen(false);
    };

    const getTimeRangeDisplayText = () => {
        switch (timeRange) {
            case "hour": return "Past 12 hours";
            case "today": return "Today";
            case "week": return "This week";
            case "month": return "This month";
            case "year": return "This year";
            default: return "This week";
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer border ${getActiveFiltersCount() > 0 ? 'border-[#43509B]' : 'border-gray-200'}`}
                >
                    <FaFilter className="h-4 w-4" />
                    <span>{getTimeRangeDisplayText()}</span>
                    <FaChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                        <div className="space-y-4">
                            {/* Quick Time Range Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quick Select
                                </label>
                                <select
                                    title="Time Range"
                                    value={timeRange}
                                    onChange={(e) => handleTimeRangeChange(e.target.value as "hour" | "today" | "week" | "month" | "year")}
                                    className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                >
                                    <option value="hour">Past 12 hours</option>
                                    <option value="today">Today</option>
                                    <option value="week">This week</option>
                                    <option value="month">This month</option>
                                    <option value="year">This year</option>
                                </select>
                            </div>

                            {/* Clear all filters and Done button */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={clearAllFilters}
                                    disabled={getActiveFiltersCount() === 0}
                                    className={`text-sm cursor-pointer rounded-lg px-2 py-1 ${getActiveFiltersCount() > 0
                                        ? 'bg-gray-300 text-black hover:bg-gray-400'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed w-full'
                                        }`}
                                >
                                    Clear all
                                </button>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="text-sm cursor-pointer bg-[#43509B] text-white hover:bg-[#3A4588] rounded-lg px-3 py-1 w-full"
                                >
                                    Done
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 