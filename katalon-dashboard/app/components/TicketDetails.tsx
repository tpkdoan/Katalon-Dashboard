"use client";
import { useState, useEffect } from "react";

interface TicketDetails {
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

interface TicketDetailsProps {
    ticketId: string;
}

export function TicketDetails({ ticketId }: TicketDetailsProps) {
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTicketDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/tickets/${ticketId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch ticket details");
                }
                const data = await response.json();
                setTicket(data);
            } catch (error) {
                console.error("Failed to load ticket details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTicketDetails();
    }, [ticketId]);

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

    if (!ticket) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-500">Ticket not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-4 md:mx-32">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-gray-600">Ticket #{ticket.id}</p>
                        <p className="text-gray-600">Created at {new Date(ticket.createdAt).toLocaleString()}</p>
                        <h1 className="mt-4 text-2xl font-semibold text-[#292D32]">{ticket.subject}</h1>
                        <p className="text-gray-600">{ticket.description}</p>
                    </div>
                </div>
            </div>

            {/* Essential Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Organization ID</p>
                            <p className="font-medium">{ticket.organizationId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Time Zone</p>
                            <p className="font-medium">{ticket.timeZone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Number of Affected Users</p>
                            <p className="font-medium">{ticket.numberOfAffectedUsers}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Product</p>
                            <p className="font-medium">{ticket.product}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Type of Testing</p>
                            <p className="font-medium">{ticket.typeOfTesting}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Environment</p>
                            <p className="font-medium">{ticket.environment}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Katalon Version</p>
                            <p className="font-medium">{ticket.katalonVersion}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Other Version</p>
                            <p className="font-medium">{ticket.otherVersion}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs and Additional Information */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#292D32]">Katalon Studio or Runtime Engine Logs</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Execution Log</p>
                            <div className="bg-gray-50 p-3 rounded-md text-sm font-mono">
                                {ticket.executionLog || "No execution log provided"}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Error Log</p>
                            <div className="bg-gray-50 p-3 rounded-md text-sm font-mono">
                                {ticket.errorLog || "No error log provided"}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">How would your work be affected if this issue has not been resolved?</p>
                            <p className="font-medium">{ticket.affectedWork || "Not specified"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Add other users as CCs on tickets</p>
                            <p className="font-medium">{ticket.addOtherUser || "Not specified"}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
