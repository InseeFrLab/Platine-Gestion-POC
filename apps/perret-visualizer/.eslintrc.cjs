/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@platine/eslint-config/app.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
