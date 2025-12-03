module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    testMatch: [
        "**/__tests__/**/*.test.(ts|js)",
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/*.e2e-spec.ts",
    ],
    testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
    clearMocks: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.spec.json",
        },
    },
};
