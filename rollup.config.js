import { defineConfig } from 'rollup';

import typescript from '@rollup/plugin-typescript';

import dts from 'rollup-plugin-dts';

import terser from '@rollup/plugin-terser';

export default defineConfig([
    {
        external: ['bun', './src/__tests__', './bench'],

        input: './src/index.ts',

        output: {
            file: './dist/index.js',

            format: 'esm',
        },
        plugins: [
            typescript({ exclude: ['**/__tests__/**', '**/bench/**'] }),
            terser(),
        ],
    },
    {
        external: ['bun', './src/__tests__', './bench'],
        input: './src/index.ts',
        output: {
            file: './dist/index.d.ts',
            format: 'module',
        },
        plugins: [dts()],
    },
]);
