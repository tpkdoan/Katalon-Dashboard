"use client";
import { useEffect, useState, useRef } from "react";
import { FaFilter, FaChevronDown, FaSearch, FaTicketAlt } from "react-icons/fa";
import {
    PRODUCT_OPTIONS,
    TIMEZONE_OPTIONS,
    TESTING_TYPE_OPTIONS,
    AFFECTED_USERS_OPTIONS,
    KATALON_VERSION_OPTIONS
} from "../lib/ticketOptions";

interface TicketItem {
    id: string;
    // Essential Information
    subject: string;
    description: string;
    organizationId: string;
    timeZone: string;
    numberOfAffectedUsers: string;
    product: string;
    typeOfTesting: string;
    environment: string;
    katalonVersion: string;
    otherVersion: string;

    // Logs and Additional Information
    executionLog: string;
    errorLog: string;
    affectedWork: string;
    addOtherUser: string;

    // System fields
    createdAt: string;
}

export function Ticket({ onTicketSelect }: { onTicketSelect: (id: string) => void }) {
    const [tickets, setTickets] = useState<TicketItem[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<TicketItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [productFilter, setProductFilter] = useState<string>("all");
    const [timezoneFilter, setTimezoneFilter] = useState<string>("all");
    const [testingTypeFilter, setTestingTypeFilter] = useState<string>("all");
    const [affectedUsersFilter, setAffectedUsersFilter] = useState<string>("all");
    const [katalonVersionFilter, setKatalonVersionFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadTickets = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/tickets");
                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }
                const data = await response.json();
                setTickets(data);
                setFilteredTickets(data);
            } catch (error) {
                console.error("Failed to load tickets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTickets();
    }, []);

    useEffect(() => {
        let filtered = tickets;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(ticket =>
                ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply product filter
        if (productFilter !== "all") {
            filtered = filtered.filter(ticket => ticket.product === productFilter);
        }

        // Apply timezone filter
        if (timezoneFilter !== "all") {
            filtered = filtered.filter(ticket => ticket.timeZone === timezoneFilter);
        }

        // Apply testing type filter
        if (testingTypeFilter !== "all") {
            filtered = filtered.filter(ticket => ticket.typeOfTesting === testingTypeFilter);
        }

        // Apply affected users filter
        if (affectedUsersFilter !== "all") {
            filtered = filtered.filter(ticket => ticket.numberOfAffectedUsers === affectedUsersFilter);
        }

        // Apply Katalon version filter
        if (katalonVersionFilter !== "all") {
            filtered = filtered.filter(ticket => ticket.katalonVersion === katalonVersionFilter);
        }

        setFilteredTickets(filtered);
        setCurrentPage(1);
    }, [tickets, searchTerm, productFilter, timezoneFilter, testingTypeFilter, affectedUsersFilter, katalonVersionFilter]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#F9F9FA]"
                    />
                </div>

                {/* Filter Button */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9F9FA] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <FaFilter className="h-4 w-4" />
                        Filter
                        <FaChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filter Dropdown */}
                    {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                            <div className="space-y-4">
                                {/* Product Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                                    <select
                                        value={productFilter}
                                        onChange={(e) => setProductFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Products</option>
                                        {PRODUCT_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Timezone Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                    <select
                                        value={timezoneFilter}
                                        onChange={(e) => setTimezoneFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Timezones</option>
                                        {TIMEZONE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Testing Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type of Testing</label>
                                    <select
                                        value={testingTypeFilter}
                                        onChange={(e) => setTestingTypeFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Types</option>
                                        {TESTING_TYPE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Affected Users Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Affected Users</label>
                                    <select
                                        value={affectedUsersFilter}
                                        onChange={(e) => setAffectedUsersFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Ranges</option>
                                        {AFFECTED_USERS_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Katalon Version Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Katalon Version</label>
                                    <select
                                        value={katalonVersionFilter}
                                        onChange={(e) => setKatalonVersionFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Versions</option>
                                        {KATALON_VERSION_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Tickets Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium w-24">ID</th>
                            <th className="px-6 py-3 font-medium">Subject</th>
                            <th className="px-6 py-3 font-medium">Product</th>
                            <th className="px-6 py-3 font-medium">Type of Testing</th>
                            <th className="px-6 py-3 font-medium">Affected Users</th>
                            <th className="px-6 py-3 font-medium">Created</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {currentItems.map((ticket) => (
                            <tr
                                key={ticket.id}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onTicketSelect(ticket.id)}
                            >
                                <td className="px-6 py-4 font-semibold text-[#363636] w-24 truncate">{ticket.id}</td>
                                <td className="px-6 py-4 text-gray-600 max-w-[300px] truncate">{ticket.subject}</td>
                                <td className="px-6 py-4">
                                    {ticket.product}
                                </td>
                                <td className="px-6 py-4">
                                    {ticket.typeOfTesting}
                                </td>
                                <td className="px-6 py-4">{ticket.numberOfAffectedUsers}</td>
                                <td className="px-6 py-4">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length} tickets
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 border rounded-md ${currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
