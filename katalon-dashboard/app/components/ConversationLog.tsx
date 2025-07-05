"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSort, FaChevronDown, FaTimes } from "react-icons/fa";

interface ConversationLogItem {
    conversationId: string;
    createdAt: string;
}

export function ConversationLog({ onConversationSelect }: { onConversationSelect: (id: string) => void }) {
    const [conversationLog, setConversationLog] = useState<ConversationLogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

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
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        if (isSortOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSortOpen]);

    useEffect(() => {
        const loadData = async () => {
            await new Promise((res) => setTimeout(res, 600)); // Simulate loading

            const mock: ConversationLogItem[] = [
                { conversationId: "987XYZOOJJ", createdAt: "2025-05-27T10:30:00Z" },
                { conversationId: "456ACBOAJA", createdAt: "2025-05-25T10:30:00Z" },
                { conversationId: "012ACBOAJA", createdAt: "2025-05-20T10:30:00Z" },
                { conversationId: "892456ACBO", createdAt: "2025-05-28T10:30:00Z" },
                { conversationId: "CL-009", createdAt: "2025-05-22T10:30:00Z" },
                { conversationId: "CL-010", createdAt: "2025-05-21T10:30:00Z" },
                { conversationId: "CL-011", createdAt: "2025-05-23T10:30:00Z" },
                { conversationId: "CL-012", createdAt: "2025-05-24T10:30:00Z" },
                { conversationId: "CL-013", createdAt: "2025-05-26T10:30:00Z" },
                { conversationId: "CL-014", createdAt: "2025-05-29T10:30:00Z" }
            ];

            setConversationLog(mock);
            setIsLoading(false);
        };

        loadData();
    }, []);

    const uniqueModels = Array.from(new Set(conversationLog.map((f) => f.conversationId)));

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
        setIsSortOpen(false);
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
            {/* Search and Sort */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative w-[300px]">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by ID or response..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#F9F9FA]"
                    />
                </div>

                {/* Sort Dropdown - styled as text */}
                <div className="relative select-none" ref={sortRef}>
                    <span className="text-gray-500 mr-2">Sorted by :</span>
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] font-semibold text-[#23272F] focus:outline-none hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ fontWeight: 700 }}
                    >
                        {sortBy === "latest" ? "Newest" : "Oldest"}
                        <FaChevronDown className={`h-3 w-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}  />
                    </button>
                    {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={() => handleSortChange("latest")}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === "latest" ? "font-bold text-[#23272F]" : "text-gray-700"}`}
                            >
                                Newest
                            </button>
                            <button
                                onClick={() => handleSortChange("oldest")}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === "oldest" ? "font-bold text-[#23272F]" : "text-gray-700"}`}
                            >
                                Oldest
                            </button>
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
                            <th className="px-6 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {currentItems.map((fb) => (
                            <tr
                                key={fb.conversationId + fb.createdAt}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onConversationSelect(fb.conversationId)}
                            >
                                <td className="px-6 py-4 font-semibold text-[#363636]">{fb.conversationId}</td>
                                <td className="px-6 py-4">
                                    {new Date(fb.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedData.length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                        No conversations matched your search.
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