import crypto from "crypto";
import { EachMessagePayload } from "kafkajs";

import { getLogger } from "../utils/logger";

import ProfileService from "./profileService";

const logger = getLogger("MessageHandler");

interface UserRegisteredMessage {
  userId: string;
  username: string;
  signature: string;
}

export const handleUserRegistered = async ({
  topic,
  partition,
  message,
}: EachMessagePayload): Promise<void> => {
  const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;

  try {
    const messageValue = message.value?.toString();

    if (!messageValue) {
      logger.warn(`${prefix} - Received empty message`);
      return;
    }

    logger.info(`${prefix} - Received user-registered event: ${messageValue}`);

    const receivedMessage: UserRegisteredMessage = JSON.parse(messageValue);

    const { signature, ...originalMessage } = receivedMessage;

    const secretKey = process.env.KAFKA_MESSAGE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key not set in environment variables");
    }

    const messageString = JSON.stringify(originalMessage);
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(messageString)
      .digest("hex");

    if (signature !== expectedSignature) {
      logger.warn(`${prefix} - Received message with invalid signature.`);
      return;
    }

    const { userId, username } = originalMessage;

    await ProfileService.addProfile({ userId, username });
    logger.info(`Profile created for userId: ${userId}, username: ${username}`);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`${prefix} - Error handling message: ${err.message}`);
  }
};
