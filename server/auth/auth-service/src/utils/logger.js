import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, label } = format;

const mainFormat = printf(
  ({ level, message, timestamp, label, ...metadata }) => {
    const metaString = Object.keys(metadata).length
      ? JSON.stringify(metadata)
      : "";
    return `${timestamp} [${label}] [${level.toUpperCase()}]: ${message} ${metaString}`;
  }
);

const consoleFormat = printf(({ level, message, label, ...metadata }) => {
  const metaString = Object.keys(metadata).length
    ? JSON.stringify(metadata)
    : "";
  return `[${label}] [${level.toUpperCase()}]: ${message} ${metaString}`;
});

const createTransports = (customLabel) => {
  if (process.env.NODE_ENV === "test") {
    return [
      new transports.Console({
        silent: true,
      }),
    ];
  }

  return [
    new transports.Console({
      format: combine(label({ label: customLabel }), consoleFormat),
    }),
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(label({ label: customLabel }), timestamp(), mainFormat),
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(label({ label: customLabel }), timestamp(), mainFormat),
    }),
  ];
};

export const getLogger = (customLabel = "Default") => {
  return createLogger({
    level: process.env.NODE_ENV === "test" ? "silent" : "info",
    format: label({ label: customLabel }),
    transports: createTransports(customLabel),
  });
};
