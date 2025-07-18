"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";


interface FeedbackDetails {
    id: string;
    conversationId: string;
    model: string;
    userQuestion: string;
    aiResponse: string;
    type: "good" | "bad";
    comment: string;
}

interface FeedbackDetailsProps {
    feedbackId: string;
}

export function FeedbackDetails({ feedbackId }: FeedbackDetailsProps) {
    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true); useState<Partial<FeedbackDetails>>({});

    useEffect(() => {
        // Simulate loading feedback details
        const loadFeedbackDetails = async () => {
            setIsLoading(true);
            // Simulate API call
            const feedbackRes = await fetch(`/api/feedbacks/${feedbackId}`);
            const feedbackData = await feedbackRes.json();
            const messageRes = await fetch(`/api/messages/${feedbackData.messageId}`);
            const messageData = await messageRes.json();

            const mockDetails: FeedbackDetails = {
                id: feedbackId,
                conversationId: messageData.conversationId,
                model: messageData.model,
                userQuestion: messageData.content,
                aiResponse: feedbackData.comment,
                type: feedbackData.type,
                comment: feedbackData.comment
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

    if (!feedback) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-500">Feedback not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-8 md:mx-32">
            <h1 className="text-2xl font-semibold text-center">Feedback Information</h1>

            <div className="text-normal text-gray-600 space-y-1">
                <div className="text-[#292D32]"><strong>Feedback ID:</strong> {feedback.id}</div>
                <div className="text-[#292D32]"><strong>Conversation ID:</strong>
                    <a href="#"> {feedback.conversationId}</a></div>
                <div className="text-[#292D32]"><strong>Model Used:</strong> {feedback.model}</div>
            </div>

            {feedback.type === "bad" && (
                <div>
                    <div className="flex items-center gap-2 text-red-600 font-normal">
                        <div className="border border-red-600 rounded-full p-1.5 bg-red-600 text-white">
                            <AiOutlineDislike />
                        </div>
                        Bad response
                    </div>
                    <p className="mt-6 bg-red-100 text-red-700 p-3 rounded text-base border border-red-300">
                        {feedback.comment}
                    </p>
                </div>
            )}

            {feedback.type === "good" && (
                <div>
                    <div className="flex items-center gap-2 text-green-600 font-normal">
                        <div className="border border-green-600 rounded-full p-1.5 bg-green-600 text-white">
                            <AiOutlineLike />
                        </div>
                        Good response
                    </div>
                    <p className="mt-6 bg-green-100 text-green-700 p-3 rounded text-base border border-green-300">
                        {feedback.comment}
                    </p>
                </div>
            )}

            <div className="">
                <div className="flex items-center gap-4 my-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-[#292D32] text-sm whitespace-nowrap font-medium">User Question</span>
                </div>
                <div className="flex justify-end">
                    <p className="text-black text-md leading-relaxed rounded-lg border-[#E7F3EF] bg-[#E7F3EF] p-2 px-4 max-w-[75%] break-words overflow-wrap-anywhere">{feedback.userQuestion}</p>
                </div>
            </div>


            <div className="">
                <div className="flex items-center gap-4 my-6">
                    <span className="text-[#292D32] text-sm whitespace-nowrap font-medium">AI Response</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                <div className="flex items-start gap-2.5">
                    <Image src="/katalon-logo.jpg" alt="User" width={32} height={32} />
                    <p className="text-black">{feedback.aiResponse}</p>
                </div>
                
            </div>

            {/* {feedback.type === "bad" && (
                <div>
                    <div className="flex items-center gap-2 text-red-600 font-normal">
                        <div className="border border-red-600 rounded-full p-1.5 bg-red-600 text-white">
                            <AiOutlineDislike />
                        </div>
                        Bad response
                    </div>
                    <p className="mt-6 bg-red-100 text-red-700 p-3 rounded text-base border border-red-300">
                        {feedback.comment}
                    </p>
                </div>
            )}

            {feedback.type === "good" && (
                <div>
                    <div className="flex items-center gap-2 text-green-600 font-normal">
                        <div className="border border-green-600 rounded-full p-1.5 bg-green-600 text-white">
                            <AiOutlineLike />
                        </div>
                        Good response
                    </div>
                    <p className="mt-6 bg-green-100 text-green-700 p-3 rounded text-base border border-green-300">
                        {feedback.comment}
                    </p>
                </div>
            )} */}

            <div className="text-center pt-2">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 underline">
                    View full conversation
                </a>
            </div>
        </div>
    );

}

