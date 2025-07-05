"use client";
import { ConversationLog } from "./../components/ConversationLog";
import { useRouter } from "next/navigation";
import { useConversationContext } from "../components/ConversationContext";

export default function ConversationPage() {
    const router = useRouter();
    const { onConversationSelect } = useConversationContext();

    const handleSelect = (id: string) => {
        // Call the parent's onConversationSelect to update sidebar state
        onConversationSelect?.(id);
        // Navigate to detail page
        router.push(`/conversation/${id}`);
    };

    return <ConversationLog onConversationSelect={handleSelect} />;
}
