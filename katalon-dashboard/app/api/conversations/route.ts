import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/dynamodb-client";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export async function GET(request: NextRequest) {
  const response = await client.send(new ScanCommand({
    TableName: "conversations",
  }));
  return NextResponse.json(response);
}