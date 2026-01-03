import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "off",
    },
  },
];
