module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "project": "./tsconfig.json"
  },
  extends: ["react-app", "prettier"],
  plugins: ["react-app", "prettier", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "error"
  }
};
