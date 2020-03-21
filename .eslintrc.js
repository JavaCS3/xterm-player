module.exports = {
  env: {
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "none",
          requireLast: true
        },
        singleline: {
          delimiter: "semi",
          requireLast: false
        }
      }
    ],
    "@typescript-eslint/semi": ["error", "never"],
    "import/order": "off",
    "no-console": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "forbid"
      },
      {
        selector: "class",
        format: ["PascalCase"]
      },
      {
        selector: "property",
        modifiers: ["readonly"],
        format: ["camelCase", "UPPER_CASE"]
      },
      {
        selector: "memberLike",
        modifiers: ["protected"],
        format: ["camelCase"],
        leadingUnderscore: "require"
      },
      {
        selector: "memberLike",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "require"
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE"]
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I"]
      }
    ]
  }
};
