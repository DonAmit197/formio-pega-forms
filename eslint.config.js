import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        ignores: ['dist/**', '.tsbuild/**', 'node_modules/**', 'server/**'],
    },

    {
        files: ['src/**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            // good “migration-friendly” rules:
            'no-unused-vars': 'off', // TS handles this better
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'off' // allow during migration
        },


    },
    // Backend (Node / Express / Multer)
    {
        files: ['server/**/*.{js}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'no-undef': 'off',
        },
    },
];
