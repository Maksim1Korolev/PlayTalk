import { getLogger } from "../utils/logger.js";

const logger = getLogger("ServiceWhitelistMiddleware");

const WHITELISTED_SERVICES = [
  "auth_service",
  "game_gateway_service",
  "communication_gateway_service",
];

export const serviceWhitelistMiddleware = (req, res, next) => {
  const serviceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceHeader = req.headers[serviceHeaderKey];

  if (serviceHeader) {
    logger.info(`Request from: ${serviceHeader}`);
  } else {
    logger.info(`Request from IP: ${req.ip}`);
  }

  if (WHITELISTED_SERVICES.includes(serviceHeader)) {
    next();
  } else {
    logger.warn(
      `Access forbidden: Service ${serviceHeader || req.ip} not allowed`
    );
    res.status(403).json({ message: "Access forbidden: Service not allowed" });
  }
};
