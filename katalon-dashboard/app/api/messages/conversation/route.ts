import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { client } from "@/lib/dynamodb-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
  }

  const command = new QueryCommand({
    TableName: "messages",
    KeyConditionExpression: "conversationId = :cid",
    ExpressionAttributeValues: {
      ":cid": { S: conversationId }
    }
  });

  const result = await client.send(command);
  const items = result.Items?.map((item) => unmarshall(item)) || [];
  return NextResponse.json(items);
}