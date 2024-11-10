import { Kafka } from "kafkajs";

import { getLogger } from "./logger.js";

const logger = getLogger("KafkaProducer");

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [process.env.KAFKA_BROKER_URL],
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
