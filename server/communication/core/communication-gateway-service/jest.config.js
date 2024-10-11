const mocksDir = "<rootDir>/src/__mocks__";

export default {
  setupFilesAfterEnv: [`${mocksDir}/redisClient.js`, `${mocksDir}/io.js`],
  testEnvironment: "node",
};
