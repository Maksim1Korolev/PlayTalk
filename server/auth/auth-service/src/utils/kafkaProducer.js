import crypto from "crypto";
import { Kafka, logLevel } from "kafkajs";

import { getLogger } from "./logger.js";

const logger = getLogger("KafkaProducer");

const kafkaLogHandler = (logEntry) => {
  const { level, log } = logEntry;
  const { message, ...metadata } = log;

  const formattedMessage = `[${metadata.logger || "KafkaProducer"}] ${message}`;
  const metaString = Object.keys(metadata).length
    ? JSON.stringify(metadata)
    : "";

  if (level === logLevel.ERROR) {
    logger.error(formattedMessage, metaString);
  } else if (level === logLevel.WARN) {
    logger.warn(formattedMessage, metaString);
  } else {
    logger.info(formattedMessage, metaString);
  }
};

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [process.env.KAFKA_BROKER_URL],
  logCreator: () => kafkaLogHandler,
});

const producer = kafka.producer();

export const connectProducer = async () => {
  const maxRetries = 5;
  const retryInterval = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await producer.connect();
      logger.info("Kafka producer connected");
      return;
    } catch (error) {
      logger.error(
        `Attempt ${attempt} - Failed to connect Kafka producer: ${error.message}`
      );
      if (attempt < maxRetries) {
        logger.info(`Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      } else {
        logger.error("Exceeded maximum retry attempts to connect to Kafka");
        throw new Error("Kafka producer wasn't successful to connect");
      }
    }
  }
};

export const sendMessage = async (topic, message) => {
  try {
    const secretKey = process.env.KAFKA_MESSAGE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "KAFKA_MESSAGE_SECRET_KEY is not set in environment variables"
      );
    }

    const messageString = JSON.stringify(message);
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(messageString)
      .digest("hex");

    const signedMessage = {
      ...message,
      signature,
    };

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(signedMessage),
        },
      ],
    });
    logger.info(`Message sent to topic ${topic}`);
  } catch (error) {
    logger.error(`Failed to send message: ${error.message}`);
  }
};

export const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    logger.info("Kafka producer disconnected");
  } catch (error) {
    logger.error(`Failed to disconnect Kafka producer: ${error.message}`);
  }
};
