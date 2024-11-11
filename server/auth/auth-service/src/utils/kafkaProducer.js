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
  try {
    await producer.connect();
    logger.info("Kafka producer connected");
  } catch (error) {
    logger.error(`Failed to connect Kafka producer: ${error.message}`);
  }
};

export const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
    logger.info(`Message sent to topic ${topic}`);
  } catch (error) {
    logger.error(`Failed to send message: ${error.message}`);
  }
};
