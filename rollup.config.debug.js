import html from '@rollup/plugin-html';
import commonjs from "@rollup/plugin-commonjs";
import ts from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import sass from 'rollup-plugin-sass';

export default {
    input: 'src/main.tsx',
    output: {
        dir: 'debug',
        format: 'umd',
        sourcemap: 'inline'
    },
    plugins: [
        html(),
        ts(),
        commonjs(),
        resolve(),
        replace({
            values: { 'process.env.NODE_ENV': '"development"' },
            preventAssignment: true
        }),
        sass({
            insert: true
        })
    ]
}