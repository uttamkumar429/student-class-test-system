module.exports = {
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.js"],
  setupFilesAfterEnv: [
  "<rootDir>/tests/setup.js",
],

  collectCoverageFrom: [
    "controllers/**/*.js",
    "services/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**",
  ],

  coverageDirectory: "coverage",

  coverageReporters: [
    "text",
    "lcov",
    "html",
  ],

  clearMocks: true,

  verbose: true,

  testTimeout: 30000,
};