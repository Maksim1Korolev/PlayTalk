const mocksDir = "<rootDir>/src/__mocks__";

export default {
  setupFilesAfterEnv: [`${mocksDir}/redisClient.js`],
  testEnvironment: "node",
};
