import { NextResponse } from "next/server";
import { client } from "@/lib/dynamodb-client";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export async function GET() {
    const response = await client.send(
        new ScanCommand({
            TableName: "messages",
        })
    );
    return NextResponse.json(response);
}
