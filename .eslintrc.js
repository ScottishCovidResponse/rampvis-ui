module.exports = {
  plugins: ["@typescript-eslint"],
  extends: [
    "next",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:import/errors",
    "plugin:import/typescript",
  ],
  rules: {
    "@typescript-eslint/comma-dangle": "off",
    "class-methods-use-this": "off",
    "comma-dangle": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "max-len": "off",
    "no-console": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-return-assign": "off",
    "no-restricted-imports": [
      "error",
      {
        name: "prop-types",
        message: "Please add TypeScript typings to props instead.",
      },
    ],
    "object-curly-newline": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-props-no-spreading": "off",
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
  },
};
