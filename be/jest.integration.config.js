const unitConfig = require("./jest.config");

module.exports = {
    ...unitConfig,
    displayName: "integration",
    testMatch: ["<rootDir>/test/**/*.integration-spec.ts"],
    testPathIgnorePatterns: [],
};
