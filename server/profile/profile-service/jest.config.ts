const mocksDir = "<rootDir>/src/__mocks__";

export default {
  preset: "ts-jest",
  setupFilesAfterEnv: [
    `${mocksDir}/redisClient.ts`,
    `${mocksDir}/mongooseClient.ts`,
  ],
  testEnvironment: "node",
};
