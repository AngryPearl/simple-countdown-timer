import globals from "globals";
import pluginJs from "@eslint/js";
import * as cssPlugin from "eslint-plugin-css";

export default [
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      plugins: ["jest"],
    },
  },
  pluginJs.configs.recommended,
  cssPlugin.configs["flat/standard"],
];
