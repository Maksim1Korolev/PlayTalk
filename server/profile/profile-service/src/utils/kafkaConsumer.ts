import { EachMessagePayload, Kafka, LogEntry, logLevel } from "kafkajs";

import { getLogger } from "./logger";

const logger = getLogger("KafkaConsumer");

// Custom log handler for Kafka logs
const kafkaLogHandler = (logEntry: LogEntry) => {
  const { level, log } = logEntry;
  const { message, ...metadata } = log;

  const formattedMessage = `[${metadata.logger || "Kafka"}] ${message}`;
  const metaString = Object.keys(metadata).length
    ? JSON.stringify(metadata)
    : "";

  switch (level) {
    case logLevel.ERROR:
      logger.error(formattedMessage, metaString);
      break;
    case logLevel.WARN:
      logger.warn(formattedMessage, metaString);
      break;
    default:
      logger.info(formattedMessage, metaString);
  }
};

const kafkaBrokerUrl = process.env.KAFKA_BROKER_URL;
if (!kafkaBrokerUrl) {
  throw new Error("KAFKA_BROKER_URL is not set in environment variables");
}

const kafka = new Kafka({
  clientId: "profile-service",
  brokers: [kafkaBrokerUrl],
  logCreator: () => kafkaLogHandler,
});

const consumer = kafka.consumer({ groupId: "profile-service-group" });

export const connectConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();
    logger.info("Kafka consumer connected");

    await consumer.subscribe({ topic: "user-registered", fromBeginning: true });
    logger.info("Subscribed to topic user-registered");
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`Failed to connect Kafka consumer: ${err.message}`);
  }
};

export const runConsumer = async (
  messageHandler: (payload: EachMessagePayload) => Promise<void>
): Promise<void> => {
  if (typeof messageHandler !== "function") {
    throw new Error("Invalid messageHandler: Must be a function");
  }

  try {
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          await messageHandler(payload);
        } catch (error: unknown) {
          const err = error as Error;
          logger.error(`Error processing message: ${err.message}`);
        }
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`Error in consumer run: ${err.message}`);
  }
};

export const disconnectConsumer = async (): Promise<void> => {
  try {
    await consumer.disconnect();
    logger.info("Kafka consumer disconnected");
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`Error during Kafka consumer disconnection: ${err.message}`);
  }
};
