import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node
    },
    plugins: {},
    rules: {
    }
  },
  {
    files: ["**/*.{spec.js,test.js}"],
    languageOptions: {
      globals: globals.jest
    }
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/coverage/**",
      "**/.idea/**",
      "**/.vscode/**"
    ]
  }
];
