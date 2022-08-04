module.exports = {
    'parser': '@typescript-eslint/parser', // Specifies the ESLint parser
    'extends': [
        // "prettier/@typescript-eslint" // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        // "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    'parserOptions': {
        'ecmaVersion': 2018, // Allows for the parsing of modern ECMAScript features
        'sourceType': 'module', // Allows for the use of imports
        'allowImportExportEverywhere': true,
    },
    'rules': {
        'prefer-const': 2,
        'no-var': 2,
        'object-shorthand': 2,
        'no-eval': 2,
        'arrow-parens': 0,
        'no-duplicate-imports': 2,
        'one-var-declaration-per-line': 2,
        'curly': 2,
        'no-trailing-spaces': 2,
        'space-in-parens': 2,
        'no-param-reassign': 2,
        'radix': 2,
        'semi': [2, 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
        /**
         * * Add no unused vars config
         * ------------------------------------
         * Ignore pattern start with _
         * Ignore rest siblings (destructuring)
         * Ignore arguments
         * Ignore catch error
         * ------------------------------------
         */
        'no-unused-vars': [
            'error',
            {
                'ignoreRestSiblings': true,
                'argsIgnorePattern': '^_',
                'args': 'none',
                'caughtErrors': 'none',
            },
        ],
    },
};
