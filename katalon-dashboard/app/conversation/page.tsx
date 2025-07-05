"use client";
import { ConversationLog } from "./../components/ConversationLog";
import { useRouter } from "next/navigation";

export default function ConversationPage() {
    const router = useRouter();

    const handleSelect = (id: string) => {
        router.push(`/conversation/${id}`);
    };

    return <ConversationLog onConversationSelect={handleSelect} />;
}
