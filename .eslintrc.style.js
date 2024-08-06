module.exports = {
  extends: "./.eslintrc.js",
  rules: {
    "@stylistic/semi": "error",
    "array-bracket-spacing": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "react/jsx-curly-spacing": ["error", { "when": "never", "children": { "when": "always" } }],
  }
};
