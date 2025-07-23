import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: "local",
    endpoint: process.env.DYNAMO_ENDPOINT || "http://localhost:8003",
    credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
    },
});

export { client };
