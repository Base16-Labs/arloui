/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require('./index.js'),
  env: { node: true, es2022: true },
};
