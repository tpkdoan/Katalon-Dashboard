"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ConversationProvider } from "./ConversationContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openFeedbackIds, setOpenFeedbackIds] = useState<string[]>([]);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
    const [openConversationIds, setOpenConversationIds] = useState<string[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [openTicketIds, setOpenTicketIds] = useState<string[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Sync state with current route
    useEffect(() => {
        // Check if we're on a feedback detail page
        const feedbackDetailMatch = pathname?.match(/^\/feedback\/(.+)$/);
        if (feedbackDetailMatch) {
            const feedbackId = feedbackDetailMatch[1];
            setSelectedFeedbackId(feedbackId);

            // Add to open feedback IDs if not already there
            setOpenFeedbackIds(prev => {
                if (!prev.includes(feedbackId)) {
                    return [...prev, feedbackId];
                }
                return prev;
            });
        } else if (pathname === "/feedback") {
            // On feedback review page, clear selected feedback to avoid highlighting detail items
            setSelectedFeedbackId(null);
        } else {
            // On other pages, clear selected feedback
            setSelectedFeedbackId(null);
        }

        // Check if we're on a conversation detail page
        const conversationDetailMatch = pathname?.match(/^\/conversation\/(.+)$/);
        if (conversationDetailMatch) {
            const conversationId = conversationDetailMatch[1];
            setSelectedConversationId(conversationId);

            // Add to open conversation IDs if not already there
            setOpenConversationIds(prev => {
                if (!prev.includes(conversationId)) {
                    return [...prev, conversationId];
                }
                return prev;
            });
        } else if (pathname === "/conversation") {
            // On conversation log page, clear selected conversation to avoid highlighting detail items
            setSelectedConversationId(null);
        } else {
            // On other pages, clear selected conversation
            setSelectedConversationId(null);
        }

        // Check if we're on a ticket detail page
        const ticketDetailMatch = pathname?.match(/^\/ticket\/(.+)$/);
        if (ticketDetailMatch) {
            const ticketId = ticketDetailMatch[1];
            setSelectedTicketId(ticketId);

            // Add to open ticket IDs if not already there
            setOpenTicketIds(prev => {
                if (!prev.includes(ticketId)) {
                    return [...prev, ticketId];
                }
                return prev;
            });
        } else if (pathname === "/ticket") {
            // On ticket management page, clear selected ticket to avoid highlighting detail items
            setSelectedTicketId(null);
        } else {
            // On other pages, clear selected ticket
            setSelectedTicketId(null);
        }
    }, [pathname]); // Removed openFeedbackIds from dependencies

    const handleFeedbackSelect = (id: string) => {
        if (!openFeedbackIds.includes(id)) {
            setOpenFeedbackIds((prev) => [...prev, id]);
        }
        setSelectedFeedbackId(id);
    };

    const handleFeedbackClose = (id: string) => {
        setOpenFeedbackIds((prev) => prev.filter((fid) => fid !== id));
        if (selectedFeedbackId === id) {
            setSelectedFeedbackId(null);
            // If we're currently on the feedback detail page that's being closed,
            // redirect to the feedback review page
            if (pathname === `/feedback/${id}`) {
                router.push('/feedback');
            }
        }
    };

    const handleConversationSelect = (id: string) => {
        if (!openConversationIds.includes(id)) {
            setOpenConversationIds((prev) => [...prev, id]);
        }
        setSelectedConversationId(id);
    };

    const handleConversationClose = (id: string) => {
        setOpenConversationIds((prev) => prev.filter((cid) => cid !== id));
        if (selectedConversationId === id) {
            setSelectedConversationId(null);
            // If we're currently on the conversation detail page that's being closed,
            // redirect to the conversation log page
            if (pathname === `/conversation/${id}`) {
                router.push('/conversation');
            }
        }
    };

    const handleTicketSelect = (id: string) => {
        if (!openTicketIds.includes(id)) {
            setOpenTicketIds((prev) => [...prev, id]);
        }
        setSelectedTicketId(id);
    };

    const handleTicketClose = (id: string) => {
        setOpenTicketIds((prev) => prev.filter((tid) => tid !== id));
        if (selectedTicketId === id) {
            setSelectedTicketId(null);
            // If we're currently on the ticket detail page that's being closed,
            // redirect to the ticket management page
            if (pathname === `/ticket/${id}`) {
                router.push('/ticket');
            }
        }
    };
    return (
        <div className="flex h-screen bg-white">
            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                selectedFeedbackId={selectedFeedbackId}
                onFeedbackSelect={handleFeedbackSelect}
                onFeedbackClose={handleFeedbackClose}
                openFeedbackIds={openFeedbackIds}
                selectedConversationId={selectedConversationId}
                onConversationSelect={handleConversationSelect}
                onConversationClose={handleConversationClose}
                openConversationIds={openConversationIds}
                selectedTicketId={selectedTicketId}
                onTicketSelect={handleTicketSelect}
                onTicketClose={handleTicketClose}
                openTicketIds={openTicketIds}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header onOpenSidebar={() => setMobileOpen(true)} />
                <div className="flex-1 overflow-auto">
                    <ConversationProvider onConversationSelect={handleConversationSelect}>
                        {children}
                    </ConversationProvider>
                </div>
            </main>
        </div>
    );
}
