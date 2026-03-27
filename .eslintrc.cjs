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
  ],
};
