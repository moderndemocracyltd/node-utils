'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rollupPluginNodeResolve = require('rollup-plugin-node-resolve');

var _rollupPluginNodeResolve2 = _interopRequireDefault(_rollupPluginNodeResolve);

var _rollupPluginBabel = require('rollup-plugin-babel');

var _rollupPluginBabel2 = _interopRequireDefault(_rollupPluginBabel);

var _rollupPluginJson = require('rollup-plugin-json');

var _rollupPluginJson2 = _interopRequireDefault(_rollupPluginJson);

var _rollupPluginUglifyEs = require('rollup-plugin-uglify-es');

var _rollupPluginUglifyEs2 = _interopRequireDefault(_rollupPluginUglifyEs);

var _rollupPluginCommonjs = require('rollup-plugin-commonjs');

var _rollupPluginCommonjs2 = _interopRequireDefault(_rollupPluginCommonjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    input: 'src/add_tenant.js',
    output: {
        file: 'lib/add_tenant.js',
        format: 'cjs'
    },
    plugins: [(0, _rollupPluginJson2.default)(), (0, _rollupPluginNodeResolve2.default)(), (0, _rollupPluginCommonjs2.default)(), (0, _rollupPluginBabel2.default)({
        exclude: 'node_modules/**'
    })],
    external: ['aws-sdk']
};
//# sourceMappingURL=rollup.config.js.map