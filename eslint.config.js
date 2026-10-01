import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "no-alert": "error",
      "no-restricted-properties": [
        "error",
        { object: "document", property: "write" },
        { object: "document", property: "writeln" },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]",
          message: "innerHTML/outerHTML запрещены",
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: "insertAdjacentHTML запрещён",
        },
        {
          selector:
            "CallExpression[callee.property.name='createContextualFragment']",
          message: "запрещено",
        },
        {
          selector: "NewExpression[callee.name='DOMParser']",
          message: "DOMParser запрещён",
        },
      ],
    },
  },
];
