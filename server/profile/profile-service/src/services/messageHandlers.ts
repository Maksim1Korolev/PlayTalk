// src/services/messageHandlers.ts
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
      const userRegisteredEvent = JSON.parse(messageValue);
      logger.info(
        `${prefix} - Received user-registered event: ${messageValue}`
      );

      const { userId, username } = userRegisteredEvent;

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
