module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: ["tsconfig.json"]
  },
  plugins: ["@typescript-eslint", "react"],
  env: {
    browser: true,
    es6: true
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "."
      }
    },
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  ignorePatterns: [
    "dist/", "node_modules/"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended"
  ],
  rules: {
    // GRASP Specific overrides
    "import/no-named-as-default-member": "off",
    "react/no-string-refs": "off",
    // END OF GRASP Specific overrides
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-shadow": ["error", { builtinGlobals: false, hoist: "all", allow: [] }],
    "@typescript-eslint/no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
    "@typescript-eslint/prefer-optional-chain": "warn",
    "curly": ["error", "multi-line", "consistent"],
    "dot-notation": "error",
    "eol-last": "warn",
    "eqeqeq": ["error", "smart"],
    "eslint-comments/no-unused-disable": "off",   // enabled in .eslintrc.build.js
    "import/no-cycle": "warn",
    "import/no-extraneous-dependencies": "warn",
    "import/no-useless-path-segments": "warn",
    "jsx-quotes": ["error", "prefer-double"],
    "max-len": ["warn", { code: 200, ignoreUrls: true }],
    "no-bitwise": "error",
    "no-debugger": "off",
    "no-duplicate-imports": "error",
    "no-sequences": "error",
    "no-shadow": "off", // superseded by @typescript-eslint/no-shadow
    "no-tabs": "error",
    "no-unneeded-ternary": "error",
    "no-unused-expressions": ["error", { allowShortCircuit: true }],
    "no-unused-vars": "off",  // superseded by @typescript-eslint/no-unused-vars
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-useless-rename": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "no-whitespace-before-property": "error",
    "object-shorthand": "error",
    "prefer-const": ["error", { destructuring: "all" }],
    "prefer-object-spread": "error",
    "prefer-regex-literals": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "quotes": ["error", "double", { allowTemplateLiterals: true, avoidEscape: true }],
    "radix": "error",
    "react/jsx-closing-tag-location": "error",
    "react/jsx-handler-names": "off",
    "react/jsx-no-useless-fragment": "error",
    "react/no-access-state-in-setstate": "error",
    "react/no-danger": "error",
    "react/no-unsafe": ["off", { checkAliases: true }],
    "react/no-unused-state": "error",
    "react/prop-types": "off",
    "semi": "off" // superseded by @typescript-eslint/semi
  },
  overrides: [
    { // eslint configs
      files: [".eslintrc*.js"],
      env: {
        node: true
      }
    },
    { // webpack configs
      files: ["**/webpack.config.js"],
      env: {
        node: true
      },
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off",
        "quotes": ["error", "single", { allowTemplateLiterals: true, avoidEscape: true }],
      }
    }
  ]
};
