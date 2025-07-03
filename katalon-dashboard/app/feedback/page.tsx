"use client";
import { FeedbackReview } from "./../components/FeedbackReview";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
    const router = useRouter();

    const handleSelect = (id: string) => {
        router.push(`/feedback/${id}`);
    };

    return <FeedbackReview onFeedbackSelect={handleSelect} />;
}



