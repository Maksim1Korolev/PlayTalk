import { getLogger } from "../utils/logger.js";
const logger = getLogger("ServiceWhitelistMiddleware");

const WHITELISTED_SERVICES = ["communication_gateway_service"];

export const serviceWhitelistMiddleware = (req, res, next) => {
  const serviceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceHeader = req.headers[serviceHeaderKey];

  logger.info(`Request from service: ${serviceHeader}`);

  if (WHITELISTED_SERVICES.includes(serviceHeader)) {
    next();
  } else {
    logger.warn(`Service not allowed: ${serviceHeader}`);
    res.status(403).json({ message: "Access forbidden: Service not allowed" });
  }
};
