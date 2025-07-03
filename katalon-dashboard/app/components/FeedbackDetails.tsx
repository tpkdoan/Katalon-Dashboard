"use client";
import { useState, useEffect } from "react";

interface FeedbackDetails {
    id: string;
}

interface FeedbackDetailsProps {
    feedbackId: string;
}

export function FeedbackDetails({ feedbackId }: FeedbackDetailsProps) {
    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);useState<Partial<FeedbackDetails>>({});

    useEffect(() => {
        // Simulate loading feedback details
        const loadFeedbackDetails = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockDetails: FeedbackDetails = {
                id: feedbackId
            };

            setFeedback(mockDetails);
            setIsLoading(false);
        };

        loadFeedbackDetails();
    }, [feedbackId]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Feedback not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Feedback Details
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {feedback.id}
                    </p>
                </div>
            </div>

        </div>
    );
}
