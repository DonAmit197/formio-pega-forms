import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

export default {
    // 1. Set the entry point of your plugin file
    input: 'src/components/index.js',

    output: {
        // 2. Set the output file path and name
        file: 'dist/formio-componenent-plugin.iife.js',

        // 3. The crucial part: specify the IIFE format
        format: 'iife',
        // 4. A global variable name for your plugin
        // This will be how your plugin is accessed once loaded via the <script> tag.
        name: 'FormioPegaExtensionsGlobal',
        globals: {
            'formiojs': 'Formio'
        },
        sourcemap: true

    },
    external: [
        'formiojs',
        'formiojs/components/select/Select', // <- VERY IMPORTANT
    ],
    context: 'window',
    plugins: [
        // 5. Tell Rollup how to handle node_modules imports
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        commonjs(),
        json(),
        typescript({
            tsconfig: './tsconfig.json',
            // key point: emit ES modules so Rollup can bundle cleanly
            module: 'ESNext',
        }),
        babel({
            babelHelpers: 'runtime', // or 'bundled' if you don’t want @babel/runtime
            extensions: ['.js', '.ts'],
            exclude: /node_modules/,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: '> 0.5%, not dead, ie 11',
                        modules: false
                    }
                ]
            ],
            plugins: ['@babel/plugin-transform-runtime']
        })
    ]
};