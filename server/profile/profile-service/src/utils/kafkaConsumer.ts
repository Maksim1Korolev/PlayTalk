import { EachMessagePayload, Kafka, LogEntry, logLevel } from "kafkajs";

import { getLogger } from "./logger";

const logger = getLogger("KafkaConsumer");

const kafkaLogHandler = (logEntry: LogEntry) => {
  const { level, log } = logEntry;
  const { message, ...metadata } = log;

  const formattedMessage = `[${metadata.logger || "Kafka"}] ${message}`;
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
  clientId: "profile-service",
  brokers: [process.env.KAFKA_BROKER_URL!],
  logCreator: () => kafkaLogHandler,
});

const consumer = kafka.consumer({ groupId: "profile-service-group" });

export const connectConsumer = async () => {
  try {
    await consumer.connect();
    logger.info("Kafka consumer connected");

    await consumer.subscribe({ topic: "user-registered", fromBeginning: true });
    logger.info("Subscribed to topic user-registered");
  } catch (error: any) {
    logger.error(`Failed to connect Kafka consumer: ${error.message}`);
  }
};

export const runConsumer = async (
  messageHandler: (payload: EachMessagePayload) => Promise<void>
) => {
  try {
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await messageHandler(payload);
      },
    });
  } catch (error: any) {
    logger.error(`Error in consumer run: ${error.message}`);
  }
};
