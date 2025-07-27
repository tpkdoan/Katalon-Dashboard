"use client";
import { Ticket } from "./../components/Ticket";
import { useRouter } from "next/navigation";

export default function TicketPage() {
    const router = useRouter();

    const handleSelect = (id: string) => {
        // Navigate to detail page
        router.push(`/ticket/${id}`);
    };

    return <Ticket onTicketSelect={handleSelect} />;
}
