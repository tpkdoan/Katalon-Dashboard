"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch, FaChevronDown, FaFilter } from "react-icons/fa";

interface ConversationLogItem {
    conversationId: string;
    conversationTitle: string;
    createdAt: string;
}

export function ConversationLog({ onConversationSelect }: { onConversationSelect: (id: string) => void }) {
    const [conversationLog, setConversationLog] = useState<ConversationLogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Sorting
    const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const conversations = await fetch("/api/conversations");
                if (!conversations.ok) throw new Error("Failed to fetch conversations");
                const conversationsData = await conversations.json();

                const conversationItems = (conversationsData.Items || []).map((fb: any) => {
                    return {
                        conversationId: fb.id?.S,
                        conversationTitle: fb.title?.S || `Conversation ${fb.id?.S}`,
                        createdAt: fb.timestamp?.S,
                    };
                });

                setConversationLog(conversationItems);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };

        loadData();
    }, []);

    const filtered = conversationLog.filter((item) => {
        const matchesSearch =
            item.conversationId.toLowerCase().includes(searchTerm.toLowerCase());

        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        const inStartRange = !startDate || itemDate >= startDate;
        const inEndRange = !endDate || itemDate <= endDate;

        return matchesSearch && inStartRange && inEndRange;
    });

    // Sort the filtered data
    const sortedData = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortBy === "latest") {
            return dateB - dateA; // Newest first
        } else {
            return dateA - dateB; // Oldest first
        }
    });

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, startDate, endDate, sortBy]);

    const getActiveFiltersCount = () => {
        let count = 0;
        if (startDate) count++;
        if (endDate) count++;
        return count;
    };

    const clearAllFilters = () => {
        setStartDate("");
        setEndDate("");
        setCurrentPage(1); // Reset to first page when clearing filters
    };

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSortChange = (sortType: "latest" | "oldest") => {
        setSortBy(sortType);
        setIsFilterOpen(false);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by ID or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#F9F9FA]"
                    />
                </div>

                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer ${getActiveFiltersCount() > 0 ? '' : ''
                            }`}
                    >
                        <FaFilter className="h-4 w-4" />
                        <span>Filters</span>
                        {getActiveFiltersCount() > 0 && (
                            <span className="bg-[#43509B] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                        <FaChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                            <div className="space-y-4">
                                {/* Sort by Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort by Date
                                    </label>
                                    <select
                                        title="Sort"
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value as "latest" | "oldest")}
                                        className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                    >
                                        <option value="latest">Latest First</option>
                                        <option value="oldest">Oldest First</option>
                                    </select>
                                </div>

                                {/* Filter by Date */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            title="Start Date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            title="End Date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                        />
                                    </div>
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

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Conversation ID</th>
                            <th className="px-6 py-3 font-medium">Conversation Title</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {currentItems.map((item) => (
                            <tr
                                key={item.conversationId + item.createdAt}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onConversationSelect(item.conversationId)}
                            >
                                <td className="px-6 py-4 font-semibold text-[#363636]">{item.conversationId}</td>
                                <td className="px-6 py-4 text-gray-600">{item.conversationTitle}</td>
                                <td className="px-6 py-4">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedData.length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                        No conversations matched your filters.
                    </div>
                )}

                {/* Pagination */}
                <div className="my-6 flex items-center justify-between text-sm text-gray-500 px-6">
                    <p>
                        Showing {sortedData.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
                    </p>
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation of conversation items">
                            <ul className="flex items-center -space-x-px h-8 text-sm">
                                <li>
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 border-gray-300 rounded-s-lg cursor-pointer ${currentPage === 1
                                            ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                                            : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                            }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                        </svg>
                                    </button>
                                </li>

                                {/* Generate page numbers */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <li key={page}>
                                        <button
                                            onClick={() => handlePageChange(page)}
                                            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 cursor-pointer ${page === currentPage
                                                ? "border-[#43509B] bg-[#43509B] hover:bg-[#43509B]/80 text-white"
                                                : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}

                                <li>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg cursor-pointer ${currentPage === totalPages
                                            ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                                            : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}