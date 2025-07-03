"use client";
import { useState, useEffect } from "react";

interface FeedbackDetails {
    id: string;
    userId: string;
    userEmail: string;
    rating: number;
    category: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    conversationId?: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    assignedTo?: string;
    notes?: string;
}

interface FeedbackDetailsProps {
    feedbackId: string;
}

export function FeedbackDetails({ feedbackId }: FeedbackDetailsProps) {
    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFeedback, setEditedFeedback] = useState<Partial<FeedbackDetails>>({});

    useEffect(() => {
        // Simulate loading feedback details
        const loadFeedbackDetails = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockDetails: FeedbackDetails = {
                id: feedbackId,
                userId: "user123",
                userEmail: "user123@example.com",
                rating: 5,
                category: "Feature Request",
                status: "pending",
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T10:30:00Z",
                title: "Add dark mode support",
                description: "Would be great to have dark mode for better user experience. Currently, the interface is quite bright and can be straining on the eyes during long coding sessions. A dark mode option would significantly improve the user experience, especially for developers who prefer dark themes in their IDEs.",
                conversationId: "CONV-456",
                tags: ["UI/UX", "Feature Request", "Accessibility"],
                priority: "medium",
                assignedTo: "john.doe@katalon.com",
                notes: "This has been requested multiple times by users. Should be considered for the next sprint."
            };

            setFeedback(mockDetails);
            setEditedFeedback(mockDetails);
            setIsLoading(false);
        };

        loadFeedbackDetails();
    }, [feedbackId]);

    const handleStatusChange = (newStatus: FeedbackDetails['status']) => {
        if (feedback) {
            const updated = { ...feedback, status: newStatus, updatedAt: new Date().toISOString() };
            setFeedback(updated);
            setEditedFeedback(updated);
        }
    };

    const handleSave = async () => {
        // Simulate saving changes
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (feedback && editedFeedback) {
            const updated = { ...feedback, ...editedFeedback, updatedAt: new Date().toISOString() };
            setFeedback(updated);
        }

        setIsEditing(false);
        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getRatingStars = (rating: number) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

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
                        {feedback.id} • {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Edit Feedback
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title and Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedFeedback.title || feedback.title}
                                        onChange={(e) => setEditedFeedback({ ...editedFeedback, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white font-medium">{feedback.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={editedFeedback.description || feedback.description}
                                        onChange={(e) => setEditedFeedback({ ...editedFeedback, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback.description}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notes
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={editedFeedback.notes || feedback.notes || ""}
                                        onChange={(e) => setEditedFeedback({ ...editedFeedback, notes: e.target.value })}
                                        rows={3}
                                        placeholder="Add internal notes..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {feedback.notes || "No notes added"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conversation Link */}
                    {feedback.conversationId && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Conversation</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Conversation ID</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">{feedback.conversationId}</p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                    View Conversation
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status and Priority */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status & Priority</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                {isEditing ? (
                                    <select
                                        value={editedFeedback.status || feedback.status}
                                        onChange={(e) => handleStatusChange(e.target.value as FeedbackDetails['status'])}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                ) : (
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                                        {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Priority
                                </label>
                                {isEditing ? (
                                    <select
                                        value={editedFeedback.priority || feedback.priority}
                                        onChange={(e) => setEditedFeedback({ ...editedFeedback, priority: e.target.value as FeedbackDetails['priority'] })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                ) : (
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(feedback.priority)}`}>
                                        {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Assigned To
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedFeedback.assignedTo || feedback.assignedTo || ""}
                                        onChange={(e) => setEditedFeedback({ ...editedFeedback, assignedTo: e.target.value })}
                                        placeholder="Enter email address"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white">
                                        {feedback.assignedTo || "Unassigned"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Information</h3>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                                <p className="text-gray-900 dark:text-white font-medium">{feedback.userId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                <p className="text-gray-900 dark:text-white">{feedback.userEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-500 text-lg">{getRatingStars(feedback.rating)}</span>
                                    <span className="text-gray-500 dark:text-gray-400">({feedback.rating}/5)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metadata</h3>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Model Used</p>
                                <p className="text-gray-900 dark:text-white">{feedback.category}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(feedback.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(feedback.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {feedback.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
