module.exports = {
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
        {
            env: {
                browser: true,
                es2021: true
            },
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:react/recommended",
            ],
            files: ["src/**/*.{ts,tsx}"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            plugins: ["@typescript-eslint", "react"],
            rules: {
                "no-restricted-syntax": [
                    "error",
                    {
                        selector: "ExportDefaultDeclaration > ObjectExpression",
                        message:
                            "Assign instance to a variable before exporting as module default.",
                    },
                ],
                "@typescript-eslint/no-explicit-any": "off",
                "react/jsx-uses-react": "off",
                "react/react-in-jsx-scope": "off",
            },
        }
    ]
};
