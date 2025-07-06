"use client";
import { useEffect, useState, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaChartBar,
    FaClipboardList,
    FaComments,
    FaChevronDown,
    FaTimes,
} from "react-icons/fa";
import { TbLayoutSidebar } from "react-icons/tb";
import Image from "next/image";

interface SidebarProps {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
    selectedFeedbackId: string | null;
    onFeedbackSelect?: (feedbackId: string) => void;
    onFeedbackClose?: (feedbackId: string) => void;
    openFeedbackIds?: string[];
    selectedConversationId?: string | null;
    onConversationSelect?: (conversationId: string) => void;
    onConversationClose?: (conversationId: string) => void;
    openConversationIds?: string[];
    
}

function SidebarComponent({
    mobileOpen,
    setMobileOpen,
    selectedFeedbackId,
    onFeedbackSelect,
    onFeedbackClose,
    openFeedbackIds = [],
    selectedConversationId,
    onConversationSelect,
    onConversationClose,
    openConversationIds = [],
    
}: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hasUserClickedFeedback, setHasUserClickedFeedback] = useState(false);
    const [hasUserClickedConversation, setHasUserClickedConversation] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Navigation state
    const isInFeedbackDetail =
        pathname?.startsWith("/feedback/") && selectedFeedbackId;
    const isInConversationDetail =
        pathname?.startsWith("/conversation/") && selectedConversationId;

    const activeTab =
        pathname === "/" || pathname?.startsWith("/dashboard")
            ? "dashboard"
            : pathname?.startsWith("/conversation")
                ? isInConversationDetail
                    ? selectedConversationId || "conversation-log"
                    : "conversation-log"
                : pathname?.startsWith("/feedback")
                    ? isInFeedbackDetail
                        ? selectedFeedbackId || "feedback-review"
                        : "feedback-review"
                    : "";

    // Open dropdown when entering feedback detail and mark that user has clicked feedback
    useEffect(() => {
        if (isInFeedbackDetail && selectedFeedbackId) {
            setIsDropdownOpen(true);
            setHasUserClickedFeedback(true);
        }
    }, [isInFeedbackDetail, selectedFeedbackId]);

    // Open dropdown when entering conversation detail and mark that user has clicked conversation 
    useEffect(() => {
        if (isInConversationDetail && selectedConversationId) {
            setIsDropdownOpen(true);
            setHasUserClickedConversation(true);
        }
    }, [isInConversationDetail, selectedConversationId]);


    // Also set hasUserClickedFeedback to true when we have open feedback IDs
    // This handles the case when user navigates directly to feedback detail pages
    useEffect(() => {
        if (openFeedbackIds.length > 0 || selectedFeedbackId) {
            setHasUserClickedFeedback(true);
        }
    }, [openFeedbackIds, selectedFeedbackId]);

    // Also set hasUserClickedConversation to true when we have open conversation IDs
    // This handles the case when user navigates directly to conversation detail pages
    useEffect(() => {
        if (openConversationIds.length > 0 || selectedConversationId) {
            setHasUserClickedConversation(true);
        }
    }, [openConversationIds, selectedConversationId]);

    const handleNavigate = (tabId: string) => {
        if (tabId === "dashboard") {
            router.push("/");
        } else if (tabId === "conversation-log") {
            router.push("/conversation");
            // Keep dropdown open when clicking Conversation Log tab
            if (hasUserClickedConversation) {
                setIsDropdownOpen(true);
            }
            setHasUserClickedConversation(true);
        } else if (tabId === "feedback-review") {
            router.push("/feedback");

            // Keep dropdown open when clicking Feedback Review tab
            if (hasUserClickedFeedback) {
                setIsDropdownOpen(true);
            }
        } else {
            // Check if this is a conversation ID or feedback ID
            if (openConversationIds.includes(tabId) || selectedConversationId === tabId) {
                // Navigating to specific conversation ID
                setHasUserClickedConversation(true);
                setIsDropdownOpen(true);
                onConversationSelect?.(tabId);
                router.push(`/conversation/${tabId}`);
            } else {
                // Navigating to specific feedback ID
                setHasUserClickedFeedback(true);
                setIsDropdownOpen(true);
                onFeedbackSelect?.(tabId);
                router.push(`/feedback/${tabId}`);
            }
        }
    };

    const navigationTabs = [
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        {
            id: "feedback-review",
            label: "Feedback Review",
            icon: FaClipboardList,
        },
        { id: "conversation-log", label: "Conversation Log", icon: FaComments },
    ];

    const getIsActive = (id: string) => {
        if (id === "feedback-review") {
            // Special handling for feedback review tab
            return pathname === "/feedback" && !isInFeedbackDetail;
        }
        if (id === "conversation-log") {
            // Special handling for conversation log tab
            return pathname === "/conversation" && !isInConversationDetail;
        }
        return id === activeTab;
    };

    const renderTab = (tab: (typeof navigationTabs)[number]) => {
        const Icon = tab.icon;

        if (tab.id === "feedback-review") {
            // Only show arrow if user has clicked on a feedback detail
            const showArrow =
                hasUserClickedFeedback &&
                (openFeedbackIds.length > 0 || selectedFeedbackId);

            return (
                <div key={tab.id}>
                    <div className="flex items-center justify-between z-50"></div>
                    <button
                        onClick={() => handleNavigate(tab.id)}
                        className={`group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer hover:bg-gray-100 ${getIsActive(tab.id)
                            ? "bg-white text-black font-bold hover:bg-white"
                            : isInFeedbackDetail
                                ? "text-black font-bold" // Only font-bold when in detail page
                                : "text-black hover:bg-gray-100 font-medium"
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </span>

                        {/* Arrow icon inside button */}
                        {showArrow && (
                            <span
                                className="p-1 rounded hover:bg-gray-200  "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: isDropdownOpen ? 0 : -90,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaChevronDown className="h-3 w-3 text-[#666F8D]" />
                                </motion.div>
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen &&
                            (selectedFeedbackId ||
                                openFeedbackIds.length > 0) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-7 mt-1 space-y-1"
                                >
                                    {[
                                        ...new Set(
                                            [
                                                ...openFeedbackIds,
                                                selectedFeedbackId,
                                            ].filter(Boolean)
                                        ),
                                    ].map((id) => (
                                        <div
                                            key={id}
                                            className="group relative w-full"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleNavigate(id!)
                                                }
                                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-sm  transition-colors cursor-pointer
                                                    ${selectedFeedbackId ===
                                                        id
                                                        ? "text-[#292D32] bg-white font-bold"
                                                        : "text-black hover:bg-gray-100 font-medium"
                                                    }`}
                                            >
                                                <span className="truncate">
                                                    {id}
                                                </span>

                                                {/* Close icon inside button */}
                                                <span
                                                    className="p-1 bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onFeedbackClose?.(id!);
                                                    }}
                                                >
                                                    <FaTimes
                                                        className="h-3 w-3 text-gray-500"
                                                        title="Close"
                                                    />
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                    </AnimatePresence>
                </div>
            );
        }

        if (tab.id === "conversation-log") {
            // Only show arrow if user has clicked on a conversation detail
            const showArrow =
                hasUserClickedConversation &&
                (openConversationIds.length > 0 || selectedConversationId);

            return (
                <div key={tab.id}>
                    <div className="flex items-center justify-between z-50"></div>
                    <button
                        onClick={() => handleNavigate(tab.id)}
                        className={`group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer hover:bg-gray-100 ${getIsActive(tab.id)
                            ? "bg-white text-black font-bold hover:bg-white"
                            : isInConversationDetail
                                ? "text-black font-bold" // Only font-bold when in detail page
                                : "text-black hover:bg-gray-100 font-medium"
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </span>

                        {/* Arrow icon inside button */}
                        {showArrow && (
                            <span
                                className="p-1 rounded hover:bg-gray-200  "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: isDropdownOpen ? 0 : -90,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaChevronDown className="h-3 w-3 text-[#666F8D]" />
                                </motion.div>
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen &&
                            (selectedConversationId ||
                                openConversationIds.length > 0) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-7 mt-1 space-y-1"
                                >
                                    {[
                                        ...new Set(
                                            [
                                                ...openConversationIds,
                                                selectedConversationId,
                                            ].filter(Boolean)
                                        ),
                                    ].map((id) => (
                                        <div
                                            key={id}
                                            className="group relative w-full"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleNavigate(id!)
                                                }
                                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-sm  transition-colors cursor-pointer
                                                    ${selectedConversationId ===
                                                        id
                                                        ? "text-[#292D32] bg-white font-bold"
                                                        : "text-black hover:bg-gray-100 font-medium"
                                                    }`}
                                            >
                                                <span className="truncate">
                                                    {id}
                                                </span>

                                                {/* Close icon inside button */}
                                                <span
                                                    className="p-1 bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onConversationClose?.(id!);
                                                    }}
                                                >
                                                    <FaTimes
                                                        className="h-3 w-3 text-gray-500"
                                                        title="Close"
                                                    />
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${getIsActive(tab.id)
                    ? "bg-white text-black font-bold"
                    : "text-black hover:bg-gray-100 font-medium"
                    }`}
            >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
            </button>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="bg-[#F7F8FA] hidden md:flex flex-col h-screen z-[9998]">
                <motion.div
                    animate={{ width: isExpanded ? 280 : 64 }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    className="bg-[#F7F8FA] flex flex-col h-full"
                    
                >
                    <div className="">
                        {isExpanded ? (
                            <>
                                <div className="flex items-center gap-3 pl-6 pr-5 py-5">
                                    <Image
                                        src="/Katalon-Logomark_LightMode.png"
                                        alt="Logo"
                                        width={15}
                                        height={15}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate text-md">
                                            Admin
                                        </div>
                                    </div>
                                    <button
                                        title="Toggle Sidebar"
                                        className="hidden md:block p-1 rounded-md hover:bg-gray-200 cursor-pointer"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        <TbLayoutSidebar className="h-5 w-5 text-[#666F8D]" />
                                    </button>
                                </div>
                                {/* Render the tabs */}
                                <div className="px-3 py-2 space-y-1">
                                    {navigationTabs.map(renderTab)}
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col justify-center px-2 space-y-1 relative">
                                <button
                                    title="Toggle Sidebar"
                                    className="w-full flex items-center justify-center p-1 rounded-lg text-sm transition-colors cursor-pointer my-5 hover:bg-gray-200"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <TbLayoutSidebar className="h-5 w-5 text-[#666F8D]" />
                                </button>
                                {/* Render the tabs */}
                                {navigationTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = getIsActive(tab.id);

                                    return (
                                        <div key={tab.id} className="relative">
                                            <button
                                                onClick={() => handleNavigate(tab.id)}
                                                onMouseEnter={() => setHoveredTab(tab.id)}
                                                onMouseLeave={() => setHoveredTab(null)}
                                                className={`w-full flex items-center justify-center p-3 rounded-lg text-sm transition-colors cursor-pointer ${isActive
                                                    ? "bg-white text-black font-bold"
                                                    : "text-black hover:bg-gray-100 font-medium"
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </button>

                                            {/* Tooltip */}
                                            {hoveredTab === tab.id && (
                                                <div className="absolute left-full top-1/2 transform -translate-y-1 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-[99999] whitespace-nowrap pointer-events-none">
                                                    {tab.label}
                                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* {isExpanded ? (
                        <div className="px-3 py-2 space-y-1">
                            {navigationTabs.map(renderTab)}
                        </div>
                    ) : (
                        <div className="px-2 py-2 space-y-1">
                            {navigationTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = getIsActive(tab.id);
                                
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleNavigate(tab.id)}
                                        className={`w-full flex items-center justify-center p-3 rounded-lg text-sm transition-colors cursor-pointer ${
                                            isActive
                                                ? "bg-white text-black font-bold"
                                                : "text-black hover:bg-gray-100 font-medium"
                                        }`}
                                        title={tab.label}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </button>
                                );
                            })}
                        </div>
                    )} */}
                </motion.div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="fixed inset-0 z-50 bg-black/40 flex"
                        onClick={() => setMobileOpen(false)}
                    >
                        <div
                            className="bg-[#F7F8FA] w-4/5 h-full shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-end px-4 pt-4">
                                <button
                                    className="p-2 rounded hover:bg-gray-200"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="px-3 py-2 space-y-1">
                                {navigationTabs.map(renderTab)}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export const Sidebar = memo(SidebarComponent);