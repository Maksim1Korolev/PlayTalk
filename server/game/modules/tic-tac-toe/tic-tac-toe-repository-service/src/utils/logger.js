import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, label } = format;

const customFormat = printf(({ level, message, timestamp, label }) => {
  return `${timestamp} [${label}] [${level.toUpperCase()}]: ${message}`;
});

export const getLogger = (customLabel = "Default") => {
  return createLogger({
    level: "info",
    format: combine(label({ label: customLabel }), timestamp(), customFormat),
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        filename: "logs/application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        filename: "logs/error-%DATE%.log",
        level: "error",
        datePattern: "YYYY-MM-DD",
        maxFiles: "14d",
      }),
    ],
  });
};
