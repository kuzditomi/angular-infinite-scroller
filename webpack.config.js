const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/module.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'angular-infinite-scroll.min.js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new UglifyJsPlugin({ sourceMap: true })
    ]
}