module.exports = {
    clearMocks: true,
    moduleFileExtensions: ["ts", "js", "json"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^src/(.*)$": "<rootDir>/src/$1",
    },
    rootDir: ".",
    testEnvironment: "node",
    testMatch: ["<rootDir>/test/**/*.spec.ts", "<rootDir>/src/**/*.spec.ts"],
    testPathIgnorePatterns: ["\\.integration-spec\\.ts$", "\\.e2e-spec\\.ts$"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.spec.json",
            },
        ],
    },
};
