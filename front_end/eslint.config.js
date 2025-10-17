import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules
    }
  },
  {
<<<<<<< HEAD
    files: ["**/*.{test.js,spec.js}"],
    languageOptions: {
      globals: globals.jest
    }
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.vscode/**"
    ]
  }
];
=======
    env:{
      jest: true
    }
  }
])
>>>>>>> 3f661841c4a6dd16235e48de9cb6b5d46c7d2da2
