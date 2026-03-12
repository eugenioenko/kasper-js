import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // tslint had these off
      "no-console": "off",
      "no-bitwise": "off",
      "object-shorthand": ["error", "never"],

      // tslint:recommended has no-any; codebase uses `any` extensively
      "@typescript-eslint/no-explicit-any": "off",

      // allow _-prefixed names to signal intentionally unused
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // tslint interface-name: ["never"] — no I-prefix on interfaces
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: false },
        },
      ],
    },
  }
);
