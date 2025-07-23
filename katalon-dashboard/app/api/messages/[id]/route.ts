// katalon-dashboard/app/api/messages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { client } from "@/lib/dynamodb-client";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const command = new GetItemCommand({
        TableName: "messages",
        Key: {
            id: { S: id },
        },
    });

    const result = await client.send(command);
    if (!result.Item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(unmarshall(result.Item));
}
