import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify-es'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        json(), 
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ],
    external: [
        'aws-sdk'
    ]
}