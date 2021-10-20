import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import ts from 'rollup-plugin-ts';
import dts from 'rollup-plugin-dts';
import sass from 'rollup-plugin-sass';
import { dirname } from 'path';

const pkg = require("./package.json")

const baseConfig = {
    input: 'src/index.ts',
    preserveModules: true
}

export default [{
    ...baseConfig,
    output: [{
        dir: dirname(pkg.main),
        format: 'cjs',
        sourcemap: 'inline'
    }, {
        dir: dirname(pkg.module),
        format: 'esm',
        sourcemap: 'inline'
    }],
    plugins: [
        peerDepsExternal(), // React
        ts(),
        commonjs(),
        sass(),
        sass({
            insert: true
        })
    ]
}, {
    ...baseConfig,
    output: {
        dir: dirname(pkg.types),
        format: 'esm'
    },
    external: [/\.scss$/],
    plugins: [dts()]
}]