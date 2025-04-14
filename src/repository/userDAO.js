const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");
const dotenv = require("dotenv");

const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);
dotenv.config();
const TableName = "Users";

async function postUser(user) {
    const command = new PutCommand({
        TableName,
        Item: user
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

async function getUserByUsername(username) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username" },
        ExpressionAttributeValues: { ":username": username }
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
        return data.Items[0];
    } catch (err) {
        logger.error(err);
        return null;
    }
}

async function getUserById(userId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "user_id" },
        ExpressionAttributeValues: { ":id": userId }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch (error) {
        logger.error(err);
        return null;
    }
};


module.exports = {
    postUser,
    getUserByUsername,
    getUserById
};