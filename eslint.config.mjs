import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";


export default [
  {files: ["**/*.js", "**/*.ts"], 
  languageOptions: {
    parser: tseslintParser,
    sourceType: "script"
  }},
  {languageOptions: { 
    globals: {
      ...globals.browser, 
      ...globals.node
    } 
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
];