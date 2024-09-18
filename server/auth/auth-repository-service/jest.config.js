const mocksDir = "<rootDir>/src/__mocks__";

export default {
  setupFilesAfterEnv: [`${mocksDir}/redisClient.js`, `${mocksDir}/logger.js`],
  testEnvironment: "node",
};
