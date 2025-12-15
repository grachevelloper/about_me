import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const baseConfig = tseslint.config(
    {
        ignores: [
            "eslint.config.mjs",
            "dist/**",
            "node_modules/**",
            "coverage/**",
            "**/*.d.ts",
        ],
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                alias: {
                    map: [
                        ["@/users/*", "./src/modules/users/*"],
                        ["@/auth/*", "./src/processes/auth/*"],
                        ["@/todos/*", "./src/modules/users/*"],
                        ["@/attachments/*", "./src/modules/attachments/*"],
                        ["@/articles/*", "./src/modules/articles/*"],
                        ["@/comments/*", "./src/modules/comments/*"],
                        ["@/likes/*", "./src/modules/likes/*"],
                        ["@/types/*", "./src/types/*"],
                        ["@/shared/*", "./src/shared/*"],
                        ["@/config/*", "./src/config/*"],
                    ],
                },
            },
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: "commonjs",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "simple-import-sort": simpleImportSort,
            "@stylistic": stylistic,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/require-await": "off",
            "prefer-const": "error",
            "no-console": ["warn", {allow: ["warn", "error"]}],

            "@stylistic/object-curly-spacing": ["warn", "never"],

            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
);

// Конфиг для тестов
const testConfig = tseslint.config({
    files: ["**/*.e2e-spec.ts", "**/*.test.ts", "**/*.spec.ts"],
    rules: {
        // Отключаем строгие проверки для тестов
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/require-await": "off",

        // Разрешаем магические числа в тестах
        "@typescript-eslint/no-magic-numbers": "off",

        // Разрешаем пустые функции для хуков
        "@typescript-eslint/no-empty-function": "off",

        // Разрешаем консоль в тестах
        "no-console": "off",

        // Разрешаем beforeEach без await
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: {
                    arguments: false,
                    attributes: false,
                },
            },
        ],

        // Специфичные для тестов правила
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/valid-expect": "error",
    },
    languageOptions: {
        globals: {
            ...globals.jest,
            describe: "readonly",
            it: "readonly",
            test: "readonly",
            expect: "readonly",
            beforeEach: "readonly",
            afterEach: "readonly",
            beforeAll: "readonly",
            afterAll: "readonly",
            jest: "readonly",
        },
    },
});

const e2eTestConfig = tseslint.config({
    files: ["**/*.e2e-spec.ts"],
    rules: {
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off",

        "@typescript-eslint/no-var-requires": "off",
    },
});

const configFilesConfig = tseslint.config({
    files: ["**/*.config.*", "**/jest.config.*", "**/webpack.config.*"],
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "no-console": "off",
    },
});

const migrationsConfig = tseslint.config({
    files: ["**/migrations/**", "**/scripts/**"],
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "no-console": "off",
    },
});

export default [
    ...baseConfig,
    ...testConfig,
    ...e2eTestConfig,
    ...configFilesConfig,
    ...migrationsConfig,
];
