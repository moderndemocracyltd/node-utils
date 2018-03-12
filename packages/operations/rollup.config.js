import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify-es';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/add_tenant.js',
    output: {
        file: 'lib/add_tenant.js',
        format: 'cjs'
    },
    plugins: [
        json(), 
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    external: [
        'aws-sdk'
    ]
};