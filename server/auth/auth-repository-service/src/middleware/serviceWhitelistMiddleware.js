const WHITELISTED_SERVICES = [
  "auth_service",
  "game_gateway_service",
  "communication_gateway_service",
];

export const serviceWhitelistMiddleware = (req, res, next) => {
  const serviceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceHeader = req.headers[serviceHeaderKey];

  console.log("Request from:", serviceHeader || req.ip);

  if (WHITELISTED_SERVICES.includes(serviceHeader)) {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Service not allowed" });
  }
};
