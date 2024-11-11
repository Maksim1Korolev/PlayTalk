import crypto from "crypto";
import { EachMessagePayload } from "kafkajs";

import { getLogger } from "../utils/logger";

import ProfileService from "./profileService";

const logger = getLogger("MessageHandler");

export const handleUserRegistered = async ({
  topic,
  partition,
  message,
}: EachMessagePayload) => {
  try {
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
    const messageValue = message.value?.toString();

    if (messageValue) {
      const receivedMessage = JSON.parse(messageValue);
      logger.info(
        `${prefix} - Received user-registered event: ${messageValue}`
      );

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

      await ProfileService.addProfile(username);

      logger.info(
        `Profile created for userId: ${userId}, username: ${username}`
      );
    } else {
      logger.warn(`${prefix} - Received empty message`);
    }
  } catch (error: any) {
    logger.error(`Error handling message: ${error.message}`);
  }
};
