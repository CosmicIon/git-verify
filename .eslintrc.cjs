module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  extends: ["eslint:recommended", "prettier"],
  ignorePatterns: ["node_modules/", "dist/", "build/"],
  overrides: [
    {
      files: ["frontend/**/*.js"],
      env: {
        browser: true,
        node: false,
      },
    },
    {
      files: ["frontend/src/server.js", "frontend/src/main.js"],
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
