"use client";
import { useEffect, useState, useRef } from "react";
import { FaFilter, FaChevronDown, FaSearch } from "react-icons/fa";

interface FeedbackItem {
    id: string;
    userId: string;
    model: string;
    type: "good" | "bad";
    createdAt: string;
    response: string;
}

export function FeedbackReview({ onFeedbackSelect }: { onFeedbackSelect: (id: string) => void }) {
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [modelFilter, setModelFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
            await new Promise((res) => setTimeout(res, 600)); // Simulate loading

            const mock: FeedbackItem[] = [
                {
                    id: "FB-001",
                    userId: "user123",
                    model: "Claude",
                    type: "good",
                    createdAt: "2024-01-15T10:30:00Z",
                    response: "Would be great to have dark mode for better UX"
                },
                {
                    id: "FB-002",
                    userId: "user456",
                    model: "GPT-4",
                    type: "bad",
                    createdAt: "2024-01-14T15:45:00Z",
                    response: "The assistant is too slow"
                },
                {
                    id: "FB-003",
                    userId: "user789",
                    model: "Claude",
                    type: "good",
                    createdAt: "2024-01-13T09:20:00Z",
                    response: "Better error messages needed"
                },
                {
                    id: "FB-004",
                    userId: "user101",
                    model: "Gemini",
                    type: "bad",
                    createdAt: "2024-01-12T14:15:00Z",
                    response: "Can't log in with Google"
                },
                {
                    id: "FB-005",
                    userId: "user202",
                    model: "Claude",
                    type: "good",
                    createdAt: "2024-01-11T11:30:00Z",
                    response: "Would like to export conversations"
                },
                {
                    id: "FB-006",
                    userId: "user303",
                    model: "GPT-4",
                    type: "good",
                    createdAt: "2024-01-10T16:20:00Z",
                    response: "The search functionality works perfectly"
                },
                {
                    id: "FB-007",
                    userId: "user404",
                    model: "Gemini",
                    type: "bad",
                    createdAt: "2024-01-09T13:45:00Z",
                    response: "Mobile app crashes frequently"
                },
                {
                    id: "FB-008",
                    userId: "user505",
                    model: "Claude",
                    type: "good",
                    createdAt: "2024-01-08T08:30:00Z",
                    response: "Love the new dashboard design"
                },
                {
                    id: "FB-009",
                    userId: "user606",
                    model: "GPT-4",
                    type: "bad",
                    createdAt: "2024-01-07T12:15:00Z",
                    response: "Can't upload files larger than 10MB"
                },
                {
                    id: "FB-010",
                    userId: "user707",
                    model: "Gemini",
                    type: "good",
                    createdAt: "2024-01-06T17:00:00Z",
                    response: "The notification system is very helpful"
                }
            ];

            setFeedback(mock);
            setIsLoading(false);
        };

        loadData();
    }, []);

    const uniqueModels = Array.from(new Set(feedback.map((f) => f.model)));

    const filtered = feedback.filter((item) => {
        const matchesSearch =
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.response.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesModel = modelFilter === "all" || item.model === modelFilter;

        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        const inStartRange = !startDate || itemDate >= startDate;
        const inEndRange = !endDate || itemDate <= endDate;

        return matchesSearch && matchesType && matchesModel && inStartRange && inEndRange;
    });

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter, modelFilter, startDate, endDate]);

    const getStatusStyle = (type: "good" | "bad") =>
        type === "good"
            ? "bg-green-100 text-green-700 border border-green-500"
            : "bg-red-100 text-red-700 border border-red-500";

    const getActiveFiltersCount = () => {
        let count = 0;
        if (typeFilter !== "all") count++;
        if (modelFilter !== "all") count++;
        if (startDate) count++;
        if (endDate) count++;
        return count;
    };

    const clearAllFilters = () => {
        setTypeFilter("all");
        setModelFilter("all");
        setStartDate("");
        setEndDate("");
        setCurrentPage(1); // Reset to first page when clearing filters
    };

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filtered.slice(startIndex, endIndex);

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

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by ID or response..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#F9F9FA]"
                    />
                </div>

                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${getActiveFiltersCount() > 0 ? '' : ''
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
                        <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 p-4">
                            <div className="space-y-4">
                                {/* Filter by Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="good">Good</option>
                                        <option value="bad">Bad</option>
                                    </select>
                                </div>

                                {/* Filter by Model */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Model
                                    </label>
                                    <select
                                        value={modelFilter}
                                        onChange={(e) => setModelFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                    >
                                        <option value="all">All Models</option>
                                        {uniqueModels.map((model) => (
                                            <option key={model} value={model}>
                                                {model}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filter by Date */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded border focus:outline-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End Date
                                        </label>
                                        <input
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
                            <th className="px-6 py-3 font-medium">ID</th>
                            <th className="px-6 py-3 font-medium">Response</th>
                            <th className="px-6 py-3 font-medium">Model</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {currentItems.map((fb) => (
                            <tr
                                key={fb.id}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onFeedbackSelect(fb.id)}
                            >
                                <td className="px-6 py-4 font-semibold text-[#363636]">{fb.id}</td>
                                <td className="px-6 py-4 text-gray-600 truncate max-w-[300px]">{fb.response}</td>
                                <td className="px-6 py-4">{fb.model}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-[2px] text-sm font-medium rounded-full ${getStatusStyle(fb.type)}`}>
                                        {fb.type.charAt(0).toUpperCase() + fb.type.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(fb.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                        No feedback matched your filters.
                    </div>
                )}

                {/* Pagination */}
                <div className="my-6 flex items-center justify-between text-sm text-gray-500 px-6">
                    <p>
                        Showing {filtered.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries
                    </p>
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation of feedback items">
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
