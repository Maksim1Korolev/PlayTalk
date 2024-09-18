import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, label } = format;

const customFormat = printf(({ level, message, timestamp, label }) => {
  return `${timestamp} [${label}] [${level.toUpperCase()}]: ${message}`;
});

const consoleFormat = printf(({ level, message, label }) => {
  return `[${label}] [${level.toUpperCase()}]: ${message}`;
});

const createTransports = customLabel => [
  new transports.Console({
    format: combine(label({ label: customLabel }), consoleFormat),
  }),
  new DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    format: combine(label({ label: customLabel }), timestamp(), customFormat),
  }),
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    level: "error",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    format: combine(label({ label: customLabel }), timestamp(), customFormat),
  }),
];

export const getLogger = (customLabel = "Default") => {
  return createLogger({
    level: "info",
    format: label({ label: customLabel }),
    transports: createTransports(customLabel),
  });
};
