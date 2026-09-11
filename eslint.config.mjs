import withNext from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...withNext,
  {
    ignores: [".next/**"],
  },
];

export default config;