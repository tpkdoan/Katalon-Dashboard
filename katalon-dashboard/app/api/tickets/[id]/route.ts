import { NextRequest, NextResponse } from "next/server";

// Mock data - replace with actual database queries
const mockTickets = [
    {
        id: "TICK-001",
        // Essential Information
        subject: "Element not found error in test suite",
        description:
            "Our test suite consistently crashes at the same step with an 'Element not found' error, even though the element is clearly visible in the DOM. We've tried using wait commands and different selectors, but the issue persists. This is affecting our CI/CD pipeline and blocking our releases.",
        organizationId: "ORG-001",
        timeZone: "UTC-05:00",
        numberOfAffectedUsers: "10-20",
        product: "Katalon Studio Enterprise (per-User)",
        typeOfTesting: "Web",
        environment: "Production",
        katalonVersion: "Version 9.7.4",
        otherVersion: "Chrome 120.0.0",
        // Logs and Additional Information
        executionLog: "Test execution log details...",
        errorLog: "Element not found: #login-button",
        affectedWork: "Login functionality tests",
        addOtherUser: "testuser@company.com",
        // System fields
        createdAt: "2024-01-15T10:30:00Z",
    },
    {
        id: "TICK-002",
        // Essential Information
        subject: "Performance degradation in large test suites",
        description:
            "Significant slowdown when running test suites with more than 100 test cases",
        organizationId: "ORG-002",
        timeZone: "UTC-08:00",
        numberOfAffectedUsers: "5-10",
        product: "Katalon Runtime Engine (Floating)",
        typeOfTesting: "Web",
        environment: "Staging",
        katalonVersion: "Version 9.7.3",
        otherVersion: "Firefox 115.0.0",
        // Logs and Additional Information
        executionLog: "Performance test execution log...",
        errorLog: "Timeout after 30 minutes",
        affectedWork: "E-commerce test suite",
        addOtherUser: "perfuser@company.com",
        // System fields
        createdAt: "2024-01-14T09:15:00Z",
    },
    {
        id: "TICK-003",
        // Essential Information
        subject: "API integration test failures",
        description:
            "Multiple API integration tests failing due to authentication issues",
        organizationId: "ORG-003",
        timeZone: "UTC+01:00",
        numberOfAffectedUsers: "1-5",
        product: "TestOps per-User",
        typeOfTesting: "API",
        environment: "Development",
        katalonVersion: "Version 10.0.0",
        otherVersion: "Postman 10.0.0",
        // Logs and Additional Information
        executionLog: "API test execution log...",
        errorLog: "401 Unauthorized - Invalid token",
        affectedWork: "User authentication API",
        addOtherUser: "apiuser@company.com",
        // System fields
        createdAt: "2024-01-13T16:20:00Z",
    },
    {
        id: "TICK-004",
        // Essential Information
        subject: "UI element selector inconsistencies",
        description:
            "Inconsistent behavior of UI element selectors across different browsers",
        organizationId: "ORG-004",
        timeZone: "UTC+05:00",
        numberOfAffectedUsers: "20-50",
        product: "Katalon TestOps Premium",
        typeOfTesting: "Web",
        environment: "Testing",
        katalonVersion: "Version 10.1.0",
        otherVersion: "Selenium 4.0.0",
        // Logs and Additional Information
        executionLog: "UI test execution log...",
        errorLog: "Element not found in Safari",
        affectedWork: "Cross-browser compatibility",
        addOtherUser: "uiuser@company.com",
        // System fields
        createdAt: "2024-01-12T13:45:00Z",
    },
    {
        id: "TICK-005",
        // Essential Information
        subject: "Test report generation timeout",
        description:
            "Test report generation times out for large test execution results",
        organizationId: "ORG-005",
        timeZone: "UTC-03:00",
        numberOfAffectedUsers: "50-100",
        product: "Katalon TestOps Ultimate",
        typeOfTesting: "Web",
        environment: "Production",
        katalonVersion: "Version 10.2.0",
        otherVersion: "JUnit 5.0.0",
        // Logs and Additional Information
        executionLog: "Report generation log...",
        errorLog: "Timeout after 60 minutes",
        affectedWork: "Test reporting system",
        addOtherUser: "reportuser@company.com",
        // System fields
        createdAt: "2024-01-15T08:00:00Z",
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ticket = mockTickets.find((t) => t.id === id);

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return NextResponse.json(
            { error: "Failed to fetch ticket" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const ticketIndex = mockTickets.findIndex((t) => t.id === id);

        if (ticketIndex === -1) {
            return NextResponse.json(
                { error: "Ticket not found" },
                { status: 404 }
            );
        }

        // Update the ticket
        mockTickets[ticketIndex] = {
            ...mockTickets[ticketIndex],
            ...body,
        };

        return NextResponse.json(mockTickets[ticketIndex]);
    } catch (error) {
        console.error("Error updating ticket:", error);
        return NextResponse.json(
            { error: "Failed to update ticket" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ticketIndex = mockTickets.findIndex((t) => t.id === id);

        if (ticketIndex === -1) {
            return NextResponse.json(
                { error: "Ticket not found" },
                { status: 404 }
            );
        }

        // Remove the ticket
        mockTickets.splice(ticketIndex, 1);

        return NextResponse.json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        return NextResponse.json(
            { error: "Failed to delete ticket" },
            { status: 500 }
        );
    }
}
